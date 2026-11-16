// src/components/stats/PayslipCard/index.jsx
// Recibos & Registros → página DOCUMENTOS — orquestador del flujo:
//   1. Drop zone que acepta múltiples PDFs (o uno por uno).
//   2. Cada PDF se parsea en paralelo y se agrega a una lista.
//      Duplicados se rechazan, parses fallidos quedan como "incompletos".
//   3. Generación de turnos por período en modal propio (con pregunta de
//      88 días si el país es Australia).
// El donut y el resumen por recibo viven en la página Cálculos
// (StatisticsPayslipsCalculations), que comparte datos vía usePayslipsData.
//
// Layout responsive en LIST view:
//   - Mobile: stack vertical + edición en bottom-sheet
//   - Desktop (lg+): grid de 2 columnas (lista | formulario)

import { useState, useRef, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink } from 'lucide-react';
import Card from '../../ui/Card';
import Modal from '../../ui/Modal';
import LogoLoaderModal from '../../ui/LogoLoaderModal';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { useAuth } from '../../../contexts/AuthContext';
import { usePremium } from '../../../contexts/PremiumContext';
import { useDataContext } from '../../../contexts/DataContext';
import {
  parsePayslipPDF,
  hasShiftsInPeriod,
  detectConflict,
} from '../../../services/payslipService';
import { usePayslipsData } from '../../../hooks/usePayslipsData';
import { parsePayslipClient } from '../../../services/payslipParser';
import * as firebaseService from '../../../services/firebaseService';
import logger from '../../../utils/logger';
import PayslipForm from '../PayslipForm';
import PayslipShiftGenerator from '../PayslipShiftGenerator';
import PayslipList from './PayslipList';
import PayslipGenerateButton from './PayslipGenerateButton';
import PayslipAccordions from './PayslipAccordions';
import PayslipShiftCoverage from './PayslipShiftCoverage';
import PayslipTaxSuggestion from './PayslipTaxSuggestion';
import PayslipUploadCard from './PayslipUploadCard';
import PayslipNotesFooter from './PayslipNotesFooter';
import { VIEW, emptyPayslip, toNumeric, isComplete } from './helpers';

const PayslipCard = ({ className = '', showCalculations = true }) => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  // En mobile (<1024px, mismo breakpoint que el grid lg) la edición/revisión de
  // un recibo se hace en un bottom-sheet enfocado en vez del grid de 3 columnas.
  const isMobile = useIsMobile(1024);
  const { currentUser } = useAuth() || {};
  const { works = [], shifts = [], addBulkShifts, addJob, editJob } = useDataContext() || {};

  // Datos de recibos + derivados: fuente única compartida con la página de
  // Cálculos (usePayslipsData mantiene la suscripción Firestore en tiempo real).
  const {
    payslips,
    completePayslips,
    country,
    formatMoney,
    aggregate,
    breakdown,
    fiscalSummary,
    coverageByPayslipId,
  } = usePayslipsData();

  const [view, setView] = useState(VIEW.IDLE);

  // Cuando llega el primer snapshot con payslips desde Firestore (al cargar
  // por primera vez en otro dispositivo / refresh), saltar de IDLE a LIST.
  // NO incluimos LIST→IDLE para evitar flicker mientras Firestore sincroniza.
  useEffect(() => {
    if (payslips.length > 0 && view === VIEW.IDLE) {
      setView(VIEW.LIST);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payslips.length]);

  // Form (edición o agregado manual)
  const [editingId, setEditingId] = useState(null);
  const [formValues, setFormValues] = useState(emptyPayslip());
  const [formError, setFormError] = useState(null);

  // Mensajes informativos
  const [, setParseSummary] = useState(null);
  const [conflictMessage, setConflictMessage] = useState(null);

  // Acordeones — abiertos por default en desktop (lg+) ya que hay espacio
  // sobrado en la columna derecha; en mobile arrancan cerrados para no abrumar.
  const isDesktop = typeof window !== 'undefined'
    && window.matchMedia('(min-width: 1024px)').matches;
  const [expanded, setExpanded] = useState({
    breakdown: isDesktop,
    fy: isDesktop,
  });
  const toggleExpanded = (key) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  // Estado de la generación de turnos
  const [generationStatus, setGenerationStatus] = useState(null);
  const [generatedCount, setGeneratedCount] = useState(0);
  const [generating, setGenerating] = useState(false);

  const fileInputRef = useRef(null);

  const countryLabel = country ? t(`payslip.country${country}`) : null;
  const countrySupported = Boolean(country);
  const isAustralia = country === 'AU';

  // Solo works regulares pueden recibir turnos
  const regularWorks = useMemo(
    () => works.filter((w) => w.type !== 'delivery'),
    [works]
  );

  // Misma regla que Works: el segundo trabajo tradicional es premium.
  // El generador no puede saltarse ese gate creando trabajos nuevos.
  const { isPremium } = usePremium();
  const canCreateWork = isPremium || regularWorks.length === 0;

  const periodsWithShifts = useMemo(
    () => completePayslips.filter((p) => hasShiftsInPeriod(shifts, p.periodStart, p.periodEnd)),
    [completePayslips, shifts]
  );
  const allPeriodsHaveShifts =
    completePayslips.length > 0 && periodsWithShifts.length === completePayslips.length;

  const generatablePeriods = useMemo(
    () =>
      completePayslips
        .filter((p) => !hasShiftsInPeriod(shifts, p.periodStart, p.periodEnd))
        .map((p) => ({
          periodStart: p.periodStart,
          periodEnd: p.periodEnd,
          hours: p.hours,
          gross: p.gross,
        })),
    [completePayslips, shifts]
  );

  // Tarifa efectiva estimada de los períodos a generar (bruto ÷ horas):
  // precarga las tarifas del trabajo nuevo para que los turnos generados
  // calculen ganancias consistentes con el recibo (en vez de $0/h).
  const estimatedRate = useMemo(() => {
    const totals = generatablePeriods.reduce(
      (acc, p) => ({ h: acc.h + (Number(p.hours) || 0), g: acc.g + (Number(p.gross) || 0) }),
      { h: 0, g: 0 }
    );
    if (totals.h <= 0 || totals.g <= 0) return null;
    return Math.round((totals.g / totals.h) * 100) / 100;
  }, [generatablePeriods]);

  // Carga de archivos (uno o varios PDFs)
  const handleFilesSelected = async (files) => {
    if (!files || files.length === 0) return;

    setView(VIEW.PARSING);
    setConflictMessage(null);
    setGenerationStatus(null);

    // Keep the loading modal up for a minimum time so it doesn't flash even when
    // parsing is near-instant (digital PDFs). Runs in parallel with the work.
    const minDelay = new Promise((r) => setTimeout(r, 4000));

    const arr = Array.from(files);
    const results = await Promise.all(
      arr.map(async (file) => {
        // 1) Free client-side parse first (no server/AI cost).
        try {
          const local = await parsePayslipClient(file);
          if (local?.success) return { file, response: local };
        } catch (err) {
          logger.warn('parsePayslipClient threw', err);
        }
        // 2) Fallback to the Cloud Function (e.g. scanned PDFs / odd layouts).
        try {
          const r = await parsePayslipPDF(file);
          return { file, response: r };
        } catch (err) {
          logger.warn('parsePayslipPDF threw', err);
          return { file, response: { success: false } };
        }
      })
    );

    let okCount = 0;
    let skippedConflicts = 0;
    // Para chequear duplicados, comparamos contra los payslips ya en Firestore
    // más los que vamos a persistir en este batch.
    const inFlight = [];
    const createdDocs = [];

    for (const { file, response } of results) {
      const base = emptyPayslip();
      base.fileName = file.name;
      base.source = 'pdf';

      if (response?.success && response.data) {
        const d = response.data;
        if (d.periodStart) base.periodStart = d.periodStart;
        if (d.periodEnd) base.periodEnd = d.periodEnd;
        if (d.hours !== null && d.hours !== undefined) base.hours = String(d.hours);
        if (d.gross !== null && d.gross !== undefined) base.gross = String(d.gross);
        if (d.tax !== null && d.tax !== undefined) base.tax = String(d.tax);
        if (d.employer) base.employer = d.employer;
        if (d.employee) base.employee = d.employee;
        if (d.location) base.location = d.location;
        base.parseStatus = 'ok';
        // Client text-layer parse ('pdf') is high-confidence; OCR or the Cloud
        // Function fallback are lower → flag the payslip for review.
        base.lowConfidence = response.method !== 'pdf';
        okCount += 1;
      } else {
        base.parseStatus = 'failed';
      }

      const candidate = toNumeric(base);
      if (isComplete(candidate)) {
        const existing = [...payslips, ...inFlight].filter(isComplete).map(toNumeric);
        const conflict = detectConflict(existing, candidate);
        if (conflict.isDuplicate) {
          skippedConflicts += 1;
          continue;
        }
      }
      inFlight.push(base);

      // Persistencia inmediata en Firestore (la suscripción actualiza la UI)
      if (currentUser?.uid) {
        try {
          const created = await firebaseService.addPayslip(currentUser.uid, base);
          createdDocs.push(created);
        } catch (err) {
          logger.error('PayslipCard: addPayslip failed', err);
        }
      }
    }

    setParseSummary({ ok: okCount, total: arr.length });
    if (skippedConflicts > 0) {
      setConflictMessage(t('payslip.list.duplicate'));
    }

    // UX: si entró un único PDF y no había otros previos, lo abrimos directo
    // en el form (inline en el slot del hero) para que el usuario revise sin
    // perder la lista ni los demás bloques de vista.
    const wasSingleAndFirst = payslips.length === 0 && arr.length === 1;
    if (wasSingleAndFirst && createdDocs.length === 1) {
      const onlyOne = createdDocs[0];
      setCreatingManual(false);
      setSelectedId(onlyOne.id);
      setEditingId(onlyOne.id);
      // El form trabaja con strings; convertimos los números de vuelta.
      setFormValues({
        ...onlyOne,
        gross: onlyOne.gross != null ? String(onlyOne.gross) : '',
        tax: onlyOne.tax != null ? String(onlyOne.tax) : '',
        hours: onlyOne.hours != null ? String(onlyOne.hours) : '',
      });
      setFormError(null);
    }

    await minDelay; // ensure the loading modal was shown long enough
    setView(VIEW.LIST);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileInput = (e) => {
    handleFilesSelected(e.target.files);
  };

  // El formulario es inline: usamos un flag separado para "estoy editando o
  // creando manual" sin reemplazar el view. Mantiene visibles la lista, los
  // acordeones y los demás bloques mientras editás.
  const [creatingManual, setCreatingManual] = useState(false);

  // Mobile: controla la apertura del bottom-sheet de edición. Es explícito (no
  // derivado de editingId) para que el efecto de auto-selección no abra la hoja
  // sola al cargar la página.
  const [mobileEditorOpen, setMobileEditorOpen] = useState(false);

  // El generador de turnos también es inline: ocupa el slot del hero cuando
  // el usuario clickea "Generar turnos", igual que el form de edición.
  const [showingGenerator, setShowingGenerator] = useState(false);

  // Completar días faltantes de un payslip con cobertura parcial (detector de
  // discrepancias): { payslip, coverage } del recibo activo, o null si el
  // modal de "agregar turnos faltantes" está cerrado.
  const [gapFillTarget, setGapFillTarget] = useState(null);

  // Recibo activo: se muestra editable en la 2da columna (form).
  // Clickear un recibo en la lista lo activa.
  const [selectedId, setSelectedId] = useState(null);

  // Mantiene el form de la 2da columna sincronizado con el recibo activo:
  //  - Si no hay nada válido cargado, carga el primero de la lista.
  //  - No pisa ediciones en curso (solo recarga cuando cambia la lista o el
  //    recibo editado dejó de existir); las selecciones explícitas cargan el
  //    form ellas mismas (startEdit), por eso este efecto no depende de selectedId.
  //  - Mientras se crea una entrada manual nueva, no toca el form.
  useEffect(() => {
    if (creatingManual) return;
    if (payslips.length === 0) {
      setSelectedId(null);
      setEditingId(null);
      return;
    }
    const current = editingId ? payslips.find((p) => p.id === editingId) : null;
    if (!current) {
      const first = payslips[0];
      setSelectedId(first.id);
      setEditingId(first.id);
      setFormValues({ ...first });
      setFormError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payslips, creatingManual]);

  // Acciones de la lista — los inline panels son mutuamente excluyentes
  const startManualAdd = () => {
    setEditingId(null);
    setFormValues(emptyPayslip());
    setFormError(null);
    setShowingGenerator(false);
    setCreatingManual(true);
    if (view === VIEW.IDLE) setView(VIEW.LIST);
    if (isMobile) setMobileEditorOpen(true);
  };

  // Seleccionar un recibo = activarlo en la 2da columna para editar (y mostrar
  // su resumen en la 3ra). Usado tanto por el click en la fila como por el lápiz.
  const startEdit = (id) => {
    const target = payslips.find((p) => p.id === id);
    if (!target) return;
    setSelectedId(id);
    setEditingId(id);
    setFormValues({ ...target });
    setFormError(null);
    setShowingGenerator(false);
    setCreatingManual(false);
    if (isMobile) setMobileEditorOpen(true);
  };

  // "Volver": descarta cambios sin guardar y cierra el form. Si era una entrada
  // manual nueva, la cancela (el efecto reselecciona el primero); si era edición,
  // recarga los valores originales del recibo. Usado por el botón "Volver" de la
  // lista (escritorio).
  const cancelInlineForm = () => {
    if (creatingManual) {
      setCreatingManual(false);
      setFormError(null);
      return;
    }
    const target = payslips.find((p) => p.id === editingId);
    if (target) setFormValues({ ...target });
    setFormError(null);
  };

  // "Limpiar": vacía los campos editables del recibo activo conservando el
  // contexto (id, source, fileName, parseStatus) para que el usuario los
  // re-ingrese desde cero. NO cierra el form.
  const clearInlineForm = () => {
    setFormValues((v) => ({
      ...v,
      periodStart: '',
      periodEnd: '',
      hours: '',
      gross: '',
      tax: '',
    }));
    setFormError(null);
  };

  // Cierra el bottom-sheet de edición (mobile). Si era una entrada manual sin
  // guardar, la descarta.
  const closeMobileEditor = () => {
    setMobileEditorOpen(false);
    if (creatingManual) {
      setCreatingManual(false);
      setFormError(null);
    }
  };

  const startGenerator = () => {
    setShowingGenerator(true);
  };

  const cancelGenerator = () => {
    setShowingGenerator(false);
  };

  const startGapFill = (payslip, coverage) => {
    setGapFillTarget({ payslip, coverage });
  };

  const cancelGapFill = () => {
    setGapFillTarget(null);
  };

  // ¿Estamos mostrando el form inline en el slot del hero?
  const isInlineFormOpen = creatingManual || editingId !== null;

  const removePayslip = async (id) => {
    setGenerationStatus(null);
    if (!currentUser?.uid) return;
    try {
      await firebaseService.deletePayslip(currentUser.uid, id);
      setConflictMessage(null);
      // Si borraste el recibo activo, soltamos la edición: el efecto de
      // sincronización reselecciona el primero restante (o muestra el estado
      // de subida si era el último).
      if (editingId === id) {
        setEditingId(null);
        setCreatingManual(false);
      }
    } catch (err) {
      logger.error('PayslipCard: deletePayslip failed', err);
    }
  };

  const handleFormSubmit = async () => {
    const grossNum = Number(formValues.gross);
    const taxNum = Number(formValues.tax);
    if (!grossNum || isNaN(grossNum) || isNaN(taxNum)) {
      setFormError(t('payslip.missingFields'));
      return;
    }

    // Confirming the form means the user reviewed the figures → clear the flag.
    const candidate = { ...formValues, gross: grossNum, tax: taxNum, lowConfidence: false };

    if (isComplete(candidate)) {
      const others = payslips.filter((p) => p.id !== editingId).filter(isComplete).map(toNumeric);
      const conflict = detectConflict(others, toNumeric(candidate));
      if (conflict.isDuplicate) {
        setFormError(t('payslip.list.duplicate'));
        return;
      }
    }

    if (!currentUser?.uid) {
      setFormError(t('payslip.generateError'));
      return;
    }

    try {
      if (editingId) {
        await firebaseService.updatePayslip(currentUser.uid, editingId, candidate);
      } else {
        // Entrada manual nueva: la creamos y la dejamos seleccionada para que
        // siga visible en el form (la 2da columna no se vacía).
        const created = await firebaseService.addPayslip(currentUser.uid, candidate);
        if (created?.id) {
          setSelectedId(created.id);
          setEditingId(created.id);
          setFormValues({ ...created });
        }
      }
    } catch (err) {
      logger.error('PayslipCard: form submit persistence failed', err);
      // Distinguimos "permission-denied" (rules no deployadas) del resto
      // para dar al usuario una pista más útil.
      const code = err?.code || err?.message || '';
      const friendly = code.includes('permission-denied')
        ? 'Permission denied — please update Firestore rules'
        : t('payslip.generateError');
      setFormError(friendly);
      return;
    }

    setCreatingManual(false);
    setFormError(null);
    setView(VIEW.LIST);
    setMobileEditorOpen(false);
  };

  // Generación de turnos para todos los períodos
  const handleGenerateShifts = async ({ shifts: newShifts, workId, newWorkName, australia88 }) => {
    if (!newShifts || newShifts.length === 0) return;
    setGenerating(true);
    try {
      // Si el usuario eligió crear un trabajo nuevo, lo creamos con la MISMA
      // función de la app (addJob) y enganchamos los turnos a ese id.
      // canCreateWork refuerza el gate premium por si la UI fue salteada.
      let targetWorkId = workId;
      if (newWorkName && addJob && canCreateWork) {
        const ratePayload = estimatedRate
          ? {
              baseRate: estimatedRate,
              rates: {
                day: estimatedRate,
                afternoon: estimatedRate,
                night: estimatedRate,
                saturday: estimatedRate,
                sunday: estimatedRate,
                holidays: estimatedRate,
              },
            }
          : {};
        const created = await addJob({ name: newWorkName, type: 'regular', ...ratePayload });
        targetWorkId = created?.id || null;
      }
      const finalShifts = targetWorkId
        ? newShifts.map((s) => ({ ...s, workId: targetWorkId }))
        : newShifts;

      await addBulkShifts(finalShifts);
      if (isAustralia && australia88 && targetWorkId && editJob) {
        const targetWork = regularWorks.find((w) => w.id === targetWorkId);
        if (targetWork && !targetWork.australia88Eligible) {
          await editJob(targetWorkId, { ...targetWork, australia88Eligible: true });
        }
      }
      setGeneratedCount(newShifts.length);
      setGenerationStatus('success');
      setShowingGenerator(false);
      setGapFillTarget(null);
    } catch (err) {
      logger.error('PayslipCard: error generating shifts', err);
      setGenerationStatus('error');
      setShowingGenerator(false);
      setGapFillTarget(null);
    } finally {
      setGenerating(false);
    }
  };

  const pickFiles = () => fileInputRef.current?.click();

  // ===== UI =====
  // Empty state → upload card. Otherwise the stacked result cards.
  // The loading modal overlays everything while parsing.
  // En mobile, mientras el editor (bottom-sheet) está abierto, no mostramos el
  // estado de upload aunque no haya recibos: la hoja ocupa la pantalla.
  const showUpload = payslips.length === 0 && !isInlineFormOpen && !mobileEditorOpen;

  // Cobertura de turnos del recibo activo (el que se está editando/viendo en
  // la 2da columna) — analiza el período apenas se agrega/selecciona un payslip.
  const activePayslip = editingId ? payslips.find((p) => p.id === editingId) : null;
  const activeCoverage = editingId ? coverageByPayslipId[editingId] : null;
  const payslipCoverageEl = activeCoverage ? (
    <PayslipShiftCoverage
      coverage={activeCoverage}
      onAddMissing={activePayslip ? () => startGapFill(activePayslip, activeCoverage) : null}
    />
  ) : null;

  // Same panel, but without its own border/padding — used in the desktop
  // grid where it already sits inside its own Card.
  const payslipCoverageBareEl = activeCoverage ? (
    <PayslipShiftCoverage
      coverage={activeCoverage}
      onAddMissing={activePayslip ? () => startGapFill(activePayslip, activeCoverage) : null}
      bare
    />
  ) : null;

  // Compares this payslip's implied tax rate (tax/gross) against the
  // configured rate for the work its covering shifts belong to, and offers
  // a one-click fix when they differ. Keyed by the active payslip so its
  // "applied" state doesn't leak from one payslip to the next. Passed INTO
  // PayslipForm (not rendered as its sibling) so it lives inside the form's
  // own h-full flex column — as a sibling it would overflow the card, since
  // the form already claims 100% of the parent's height for itself.
  const payslipTaxSuggestionEl = (
    <PayslipTaxSuggestion
      key={editingId || 'manual'}
      gross={formValues.gross}
      tax={formValues.tax}
      coverage={activeCoverage}
    />
  );

  // ----- Elementos reutilizados por el layout desktop (grid) y mobile (stack) -----
  const payslipFormEl = (
    <PayslipForm
      values={formValues}
      onChange={setFormValues}
      onSubmit={handleFormSubmit}
      onReset={clearInlineForm}
      parseStatus={formValues.parseStatus}
      source={formValues.source}
      fileName={formValues.fileName}
      lowConfidence={formValues.lowConfidence}
      countryLabel={countryLabel}
      countrySupported={countrySupported}
      error={formError}
      taxSuggestion={payslipTaxSuggestionEl}
    />
  );

  const renderList = (manualOpen) => (
    <PayslipList
      payslips={payslips}
      countryLabel={countryLabel}
      formatMoney={formatMoney}
      selectedId={selectedId}
      onSelect={startEdit}
      onEdit={startEdit}
      onRemove={removePayslip}
      onManualAdd={startManualAdd}
      onManualCancel={cancelInlineForm}
      isManualOpen={manualOpen}
      onPickFiles={pickFiles}
      onFilesDropped={handleFilesSelected}
    />
  );

  const generateButtonEl = completePayslips.length > 0 ? (
    <PayslipGenerateButton
      generationStatus={generationStatus}
      generatedCount={generatedCount}
      allPeriodsHaveShifts={allPeriodsHaveShifts}
      generatablePeriods={generatablePeriods}
      regularWorks={regularWorks}
      onClick={startGenerator}
    />
  ) : null;

  const conflictBannerEl = conflictMessage ? (
    <div className="flex items-start gap-2 p-2 rounded text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300">
      <span>{conflictMessage}</span>
    </div>
  ) : null;

  const accordionsBlockEl = showCalculations && completePayslips.length > 0 ? (
    <div>
      <PayslipAccordions
        breakdown={breakdown}
        fiscalSummary={fiscalSummary}
        aggregate={aggregate}
        formatMoney={formatMoney}
        expanded={expanded}
        onToggleExpanded={toggleExpanded}
      />

      {country && (
        <div className="space-y-1.5 px-1 mt-3">
          <p className="text-[11px] text-gray-400 dark:text-gray-500 italic leading-relaxed">
            {t(`payslip.fy.disclaimer${country}`)}
          </p>
          <a
            href={{
              AU: 'https://www.ato.gov.au/individuals-and-families/your-tax-return/how-to-lodge-your-tax-return/lodge-your-tax-return-online-with-mytax',
              NZ: 'https://www.ird.govt.nz/myir',
              GB: 'https://www.gov.uk/personal-tax-account',
              IE: 'https://www.revenue.ie/en/online-services/index.aspx',
            }[country]}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium hover:underline transition-colors"
            style={{ color: colors.primary }}
          >
            {t(`payslip.fy.link${country}`)}
            <ExternalLink size={12} />
          </a>
        </div>
      )}
    </div>
  ) : null;

  return (
    <div className={`w-full space-y-5 ${className}`}>
      <LogoLoaderModal
        isOpen={view === VIEW.PARSING}
        steps={[
          { title: t('payslip.verifyingTitle'), message: t('payslip.verifyingText') },
          { title: t('payslip.verifyingTitle2'), message: t('payslip.verifyingText2') },
          { title: t('payslip.verifyingTitle3'), message: t('payslip.verifyingText3') },
        ]}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        multiple
        onChange={handleFileInput}
        className="hidden"
      />

      {showUpload ? (
        <div className="flex items-center justify-center min-h-[65vh]">
          <PayslipUploadCard
            onPickFiles={pickFiles}
            onFilesDropped={handleFilesSelected}
            onManualAdd={startManualAdd}
          />
        </div>
      ) : isMobile ? (
        /* ===== MOBILE: flujo en stack + edición en bottom-sheet =====
           Orden: lista + generar → acordeones (si aplica). El formulario vive
           en el bottom-sheet; el generador, en su propio modal. */
        <>
          {conflictBannerEl}

          <Card className="p-4 flex flex-col">
            <div className="flex flex-col">
              {renderList(false)}
            </div>
            {generateButtonEl && (
              <div className="mt-3 shrink-0">{generateButtonEl}</div>
            )}
          </Card>

          {accordionsBlockEl}
        </>
      ) : (
        /* ===== DESKTOP: grid de 2 columnas estables ===== */
        <>
          {conflictBannerEl}

          {/* 2 columnas ESTABLES (no se reordenan al editar/agregar):
                Col 1 → Loaded payslips · Col 2 → Detected values (form).
              Clickear un recibo en la col 1 lo carga editable en la col 2.
              El donut y el resumen viven en la página Cálculos. */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
            {/* Col 1: Loaded payslips. */}
            <Card className="p-4 flex flex-col lg:order-1">
              <div className="flex flex-col lg:flex-1 lg:min-h-0">
                {renderList(creatingManual)}
              </div>
              {generateButtonEl && (
                <div className="mt-3 shrink-0">{generateButtonEl}</div>
              )}
            </Card>

            {/* Col 2: Detected values (form) + shift coverage — two separate
                cards stacked so together they match Col 1's height. The form
                grows to fill the remaining space; the coverage panel (when
                present) keeps its own compact height. */}
            <div className="flex flex-col gap-5 lg:order-2 lg:h-full lg:min-h-0">
              <Card className="p-4 flex-1 lg:min-h-0">
                {payslipFormEl}
              </Card>
              {payslipCoverageBareEl && (
                <Card className="p-4 shrink-0">
                  {payslipCoverageBareEl}
                </Card>
              )}
            </div>
          </div>

          {/* Acordeones (desglose + año fiscal) — ancho completo, debajo del grid */}
          {accordionsBlockEl}
        </>
      )}

      {/* Bottom-sheet de edición (solo mobile): formulario del recibo. */}
      <Modal
        isOpen={isMobile && mobileEditorOpen}
        onClose={closeMobileEditor}
        title={creatingManual ? t('payslip.newTitle') : t('payslip.editTitle')}
        size="lg"
      >
        <div className="space-y-5">
          {payslipFormEl}
          {payslipCoverageEl}
        </div>
      </Modal>

      {/* Generador de turnos en modal — antes aparecía inline arriba del grid
          desplazando todo el layout; el modal es el patrón estándar. */}
      <Modal
        isOpen={showingGenerator && generatablePeriods.length > 0}
        onClose={cancelGenerator}
        title={t('payslip.generateShifts')}
        size="lg"
      >
        <PayslipShiftGenerator
          periods={generatablePeriods}
          works={regularWorks}
          showAustralia88={isAustralia}
          loading={generating}
          canCreateWork={canCreateWork}
          estimatedRateLabel={estimatedRate !== null ? formatMoney(estimatedRate) : null}
          onCancel={cancelGenerator}
          onConfirm={handleGenerateShifts}
        />
      </Modal>

      {/* Completar días faltantes (cobertura parcial) — mismo generador, en
          modo "solo huecos": genera turnos únicamente en los días marcados
          como faltantes por PayslipShiftCoverage. */}
      <Modal
        isOpen={!!gapFillTarget}
        onClose={cancelGapFill}
        title={t('payslip.fillGapsTitle')}
        size="lg"
      >
        {gapFillTarget && (
          <PayslipShiftGenerator
            periods={[{
              periodStart: gapFillTarget.payslip.periodStart,
              periodEnd: gapFillTarget.payslip.periodEnd,
              hours: gapFillTarget.coverage.hoursDelta,
              gross: gapFillTarget.payslip.gross,
            }]}
            restrictToDates={gapFillTarget.coverage.missingDates}
            works={regularWorks}
            showAustralia88={isAustralia}
            loading={generating}
            canCreateWork={canCreateWork}
            estimatedRateLabel={
              gapFillTarget.payslip.hours > 0
                ? formatMoney(Math.round((gapFillTarget.payslip.gross / gapFillTarget.payslip.hours) * 100) / 100)
                : null
            }
            onCancel={cancelGapFill}
            onConfirm={handleGenerateShifts}
          />
        )}
      </Modal>

      <PayslipNotesFooter />
    </div>
  );
};

export default PayslipCard;
