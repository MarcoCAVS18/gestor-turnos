// src/components/stats/PayslipCard/index.jsx
// Card colapsable de Recibos & Registros — orquestador del flujo:
//   1. Drop zone que acepta múltiples PDFs (o uno por uno).
//   2. Cada PDF se parsea en paralelo y se agrega a una lista.
//      Duplicados se rechazan, parses fallidos quedan como "incompletos".
//   3. Dashboard agregado: hero (donut + métricas), acción y acordeones.
//   4. Generación de turnos para todos los períodos (con pregunta de 88 días
//      si el país es Australia).
//
// Layout responsive en LIST view:
//   - Mobile: stack vertical
//   - Desktop (lg+): grid 12 cols, lista 5/12 a la izquierda y dashboard 7/12

import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ChevronDown,
  ChevronUp,
  Upload,
  FileText,
  Plus,
  ExternalLink,
} from 'lucide-react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { useAuth } from '../../../contexts/AuthContext';
import { useConfigContext } from '../../../contexts/ConfigContext';
import { useDataContext } from '../../../contexts/DataContext';
import {
  parsePayslipPDF,
  calculateAggregateRefund,
  buildPayslipBreakdown,
  hasShiftsInPeriod,
  detectConflict,
  SUPPORTED_COUNTRIES,
  getCurrentFiscalYear,
  groupPayslipsByFiscalYear,
  buildFiscalYearSummary,
} from '../../../services/payslipService';
import * as firebaseService from '../../../services/firebaseService';
import logger from '../../../utils/logger';
import PayslipForm from '../PayslipForm';
import PayslipShiftGenerator from '../PayslipShiftGenerator';
import PayslipDropZone from './PayslipDropZone';
import PayslipList from './PayslipList';
import PayslipHero from './PayslipHero';
import PayslipGenerateButton from './PayslipGenerateButton';
import PayslipAccordions from './PayslipAccordions';
import { VIEW, emptyPayslip, toNumeric, isComplete } from './helpers';

const PayslipCard = ({ className = '' }) => {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { currentUser } = useAuth() || {};
  const { holidayCountry } = useConfigContext() || {};
  const { works = [], shifts = [], addBulkShifts, editJob } = useDataContext() || {};

  const [open, setOpen] = useLocalStorage('orary_payslip_card_open', false);

  // Lista de payslips suscrita en tiempo real desde Firestore (cross-device).
  // Se inicializa vacía y se actualiza vía onSnapshot apenas haya un user.
  const [payslips, setPayslips] = useState([]);
  const [view, setView] = useState(VIEW.IDLE);

  // Suscripción a Firestore: se mantiene activa mientras el componente esté
  // montado y haya usuario autenticado.
  useEffect(() => {
    if (!currentUser?.uid) return undefined;
    const unsub = firebaseService.subscribeToPayslips(currentUser.uid, {
      setPayslips: (next) => setPayslips(next),
      setError: (err) => logger.warn('subscribeToPayslips error', err),
    });
    return unsub;
  }, [currentUser?.uid]);

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
  const [parseSummary, setParseSummary] = useState(null);
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

  // País aplicable
  const country = useMemo(() => {
    if (holidayCountry && SUPPORTED_COUNTRIES.includes(holidayCountry)) {
      return holidayCountry;
    }
    return null;
  }, [holidayCountry]);

  const countryLabel = country ? t(`payslip.country${country}`) : null;
  const countrySupported = Boolean(country);
  const isAustralia = country === 'AU';

  // Solo works regulares pueden recibir turnos
  const regularWorks = useMemo(
    () => works.filter((w) => w.type !== 'delivery'),
    [works]
  );

  const currencyCode = country === 'NZ' ? 'NZD' : 'AUD';
  const formatMoney = useCallback((amount) => {
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currencyCode,
        maximumFractionDigits: 2,
      }).format(amount || 0);
    } catch {
      return `$${Number(amount || 0).toFixed(2)}`;
    }
  }, [currencyCode]);

  // Solo entran al cálculo los completos
  const completePayslips = useMemo(
    () => payslips.filter(isComplete).map(toNumeric),
    [payslips]
  );

  const aggregate = useMemo(
    () => calculateAggregateRefund(completePayslips, country),
    [completePayslips, country]
  );

  const breakdown = useMemo(
    () => buildPayslipBreakdown(completePayslips),
    [completePayslips]
  );

  // Resumen del año fiscal vigente
  const fiscalSummary = useMemo(() => {
    if (!country) return null;
    const currentFY = getCurrentFiscalYear(country);
    if (!currentFY) return null;
    const groups = groupPayslipsByFiscalYear(completePayslips, country);
    const inCurrentFY = groups[currentFY.label]?.payslips || [];
    return {
      currentFY,
      inCurrentFY,
      summary: inCurrentFY.length > 0 ? buildFiscalYearSummary(inCurrentFY, currentFY, country) : null,
    };
  }, [completePayslips, country]);

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
        })),
    [completePayslips, shifts]
  );

  // Carga de archivos (uno o varios PDFs)
  const handleFilesSelected = async (files) => {
    if (!files || files.length === 0) return;

    setView(VIEW.PARSING);
    setConflictMessage(null);
    setGenerationStatus(null);

    const arr = Array.from(files);
    const results = await Promise.all(
      arr.map(async (file) => {
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
        base.parseStatus = 'ok';
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

  // El generador de turnos también es inline: ocupa el slot del hero cuando
  // el usuario clickea "Generar turnos", igual que el form de edición.
  const [showingGenerator, setShowingGenerator] = useState(false);

  // Modo del Hero: 'total' (suma de todos) o 'detail' (recibo más reciente).
  // Si solo hay 1 recibo, no se puede alternar (los dos serían idénticos).
  const [heroMode, setHeroMode] = useState('total');
  const toggleHeroMode = () =>
    setHeroMode((prev) => (prev === 'total' ? 'detail' : 'total'));

  // Acciones de la lista — los inline panels son mutuamente excluyentes
  const startManualAdd = () => {
    setEditingId(null);
    setFormValues(emptyPayslip());
    setFormError(null);
    setShowingGenerator(false);
    setCreatingManual(true);
    if (view === VIEW.IDLE) setView(VIEW.LIST);
  };

  const startEdit = (id) => {
    const target = payslips.find((p) => p.id === id);
    if (!target) return;
    setEditingId(id);
    setFormValues({ ...target });
    setFormError(null);
    setShowingGenerator(false);
    setCreatingManual(false);
  };

  const cancelInlineForm = () => {
    setEditingId(null);
    setCreatingManual(false);
    setFormValues(emptyPayslip());
    setFormError(null);
  };

  const startGenerator = () => {
    cancelInlineForm();
    setShowingGenerator(true);
  };

  const cancelGenerator = () => {
    setShowingGenerator(false);
  };

  // ¿Estamos mostrando el form inline en el slot del hero?
  const isInlineFormOpen = creatingManual || editingId !== null;

  const removePayslip = async (id) => {
    setGenerationStatus(null);
    if (!currentUser?.uid) return;
    try {
      await firebaseService.deletePayslip(currentUser.uid, id);
      // Si era el último, el resto del estado se resetea desde la suscripción.
      // Si payslips queda vacío después del snapshot, volvemos manualmente a IDLE.
      if (payslips.length <= 1) setView(VIEW.IDLE);
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

    const candidate = { ...formValues, gross: grossNum, tax: taxNum };

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
        await firebaseService.addPayslip(currentUser.uid, candidate);
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

    setEditingId(null);
    setFormValues(emptyPayslip());
    setFormError(null);
    setCreatingManual(false);
    setView(VIEW.LIST);
  };

  // Generación de turnos para todos los períodos
  const handleGenerateShifts = async ({ shifts: newShifts, workId, australia88 }) => {
    if (!newShifts || newShifts.length === 0) return;
    setGenerating(true);
    try {
      await addBulkShifts(newShifts);
      if (isAustralia && australia88 && workId && editJob) {
        const targetWork = regularWorks.find((w) => w.id === workId);
        if (targetWork && !targetWork.australia88Eligible) {
          await editJob(workId, { ...targetWork, australia88Eligible: true });
        }
      }
      setGeneratedCount(newShifts.length);
      setGenerationStatus('success');
      setShowingGenerator(false);
    } catch (err) {
      logger.error('PayslipCard: error generating shifts', err);
      setGenerationStatus('error');
      setShowingGenerator(false);
    } finally {
      setGenerating(false);
    }
  };

  const pickFiles = () => fileInputRef.current?.click();

  // ===== UI =====
  const Header = (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className="w-full flex items-center justify-between gap-3 text-left"
      aria-expanded={open}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0"
          style={{ backgroundColor: colors.transparent10 }}
        >
          <FileText size={20} style={{ color: colors.primary }} />
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
            {t('payslip.title')}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {t('payslip.subtitle')}
          </p>
        </div>
      </div>
      <div className="flex-shrink-0 text-gray-400">
        {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>
    </button>
  );

  return (
    <Card className={`p-4 overflow-hidden ${className}`}>
      {Header}

      {open && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700 space-y-4 min-w-0">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleFileInput}
            className="hidden"
          />

          {/* IDLE — drop zone + opción manual */}
          {view === VIEW.IDLE && (
            <div className="space-y-3">
              <PayslipDropZone onClick={pickFiles} onFiles={handleFilesSelected} />
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('payslip.dropzone.manualHint')}
                </p>
                <Button
                  onClick={startManualAdd}
                  variant="secondary"
                  size="sm"
                  icon={Plus}
                  iconPosition="left"
                >
                  {t('payslip.addManual')}
                </Button>
              </div>
              {!countrySupported && (
                <p className="text-xs text-orange-600 dark:text-orange-400">
                  {t('payslip.unsupportedCountry')}
                </p>
              )}
            </div>
          )}

          {/* PARSING */}
          {view === VIEW.PARSING && (
            <div className="flex items-center justify-center py-8 gap-3 text-gray-600 dark:text-gray-400">
              <svg className="animate-spin" width={20} height={20} viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-sm">{t('payslip.parsing')}</span>
            </div>
          )}

          {/* FORM — manual o edición */}
          {/* LIST — lista + dashboard agregado.
              Mobile: stack vertical. Desktop (lg+): grid 12 cols con la
              lista a la izquierda (5/12) y el dashboard a la derecha (7/12).
              El form de edición/creación manual se renderiza inline en el slot
              del hero (no reemplaza toda la card como antes). */}
          {view === VIEW.LIST && (
            <div className="space-y-5 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-x-6 lg:gap-y-5">
              {/* Mensajes informativos full-width */}
              {parseSummary && (
                <div className="lg:col-span-12 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <Upload size={14} style={{ color: colors.primary }} />
                  {t('payslip.parseSummary', { ok: parseSummary.ok, total: parseSummary.total })}
                </div>
              )}
              {conflictMessage && (
                <div className="lg:col-span-12 flex items-start gap-2 p-2 rounded text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300">
                  <span>{conflictMessage}</span>
                </div>
              )}

              {/* Columna izquierda (5/12 en desktop):
                  Lista de recibos → Botón generar turnos → Hero vertical.
                  Apilados con space-y-4 para cohesión visual. */}
              <div className="lg:col-span-5 lg:self-start space-y-4">
                <PayslipList
                  payslips={payslips}
                  countryLabel={countryLabel}
                  formatMoney={formatMoney}
                  onEdit={startEdit}
                  onRemove={removePayslip}
                  onManualAdd={startManualAdd}
                  onManualCancel={cancelInlineForm}
                  isManualOpen={creatingManual}
                  onPickFiles={pickFiles}
                  onFilesDropped={handleFilesSelected}
                />

                {/* Botón generar turnos justo debajo de los botones de carga */}
                {completePayslips.length > 0 && (
                  <PayslipGenerateButton
                    generationStatus={generationStatus}
                    generatedCount={generatedCount}
                    allPeriodsHaveShifts={allPeriodsHaveShifts}
                    generatablePeriods={generatablePeriods}
                    regularWorks={regularWorks}
                    onClick={startGenerator}
                  />
                )}

                {/* Slot del hero — alterna entre tres contenidos según el estado:
                      1. Form inline (editando o creando manual)
                      2. Generador de turnos inline
                      3. Hero (donut + métricas) por default cuando hay datos
                    El resto de la card (lista, botón, acordeones) queda intacto. */}
                {isInlineFormOpen ? (
                  <PayslipForm
                    values={formValues}
                    onChange={setFormValues}
                    onSubmit={handleFormSubmit}
                    onReset={cancelInlineForm}
                    parseStatus={formValues.parseStatus}
                    source={formValues.source}
                    fileName={formValues.fileName}
                    countryLabel={countryLabel}
                    countrySupported={countrySupported}
                    error={formError}
                  />
                ) : showingGenerator && generatablePeriods.length > 0 ? (
                  <PayslipShiftGenerator
                    periods={generatablePeriods}
                    works={regularWorks}
                    showAustralia88={isAustralia}
                    loading={generating}
                    onCancel={cancelGenerator}
                    onConfirm={handleGenerateShifts}
                  />
                ) : (
                  completePayslips.length > 0 && (
                    <PayslipHero
                      aggregate={aggregate}
                      latestPayslip={completePayslips[0]}
                      formatMoney={formatMoney}
                      mode={heroMode}
                      onToggle={toggleHeroMode}
                      canToggle={completePayslips.length > 1}
                    />
                  )
                )}
              </div>

              {/* Columna derecha (7/12): acordeones + disclaimer + link.
                  Movimos el disclaimer y el link adentro de esta columna,
                  justo después del acordeón "Resumen del año fiscal", para
                  asociarlos visualmente con la sección que disclama. */}
              <div className="lg:col-span-7 lg:self-start space-y-3">
                {completePayslips.length > 0 && (
                  <>
                    <PayslipAccordions
                      breakdown={breakdown}
                      fiscalSummary={fiscalSummary}
                      aggregate={aggregate}
                      formatMoney={formatMoney}
                      expanded={expanded}
                      onToggleExpanded={toggleExpanded}
                    />

                    {/* Disclaimer del país + link a herramienta oficial */}
                    <div className="space-y-1.5 pt-1">
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 italic leading-relaxed">
                        {t(country === 'NZ' ? 'payslip.fy.disclaimerNZ' : 'payslip.fy.disclaimerAU')}
                      </p>
                      <a
                        href={
                          country === 'NZ'
                            ? 'https://www.ird.govt.nz/myir'
                            : 'https://www.ato.gov.au/individuals-and-families/your-tax-return/lodge-your-tax-return-online-with-mytax'
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium hover:underline transition-colors"
                        style={{ color: colors.primary }}
                      >
                        {t(country === 'NZ' ? 'payslip.fy.linkNZ' : 'payslip.fy.linkAU')}
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default PayslipCard;
