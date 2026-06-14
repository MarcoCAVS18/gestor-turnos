package app.orary;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.graphics.Color;
import android.os.Build;
import android.os.IBinder;
import android.os.SystemClock;

import androidx.core.app.NotificationCompat;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

public class LiveModeService extends Service {

    public static final String ACTION_START  = "app.orary.livemode.START";
    public static final String ACTION_UPDATE = "app.orary.livemode.UPDATE";
    public static final String ACTION_STOP   = "app.orary.livemode.STOP";

    private static final String CHANNEL_ID      = "live_mode_channel";
    private static final String CHANNEL_NAME    = "Live Mode";
    private static final int    NOTIFICATION_ID = 1001;

    // Session state (persists between onStartCommand calls)
    private String workName        = "Live Shift";
    private int    themeColorInt   = Color.parseColor("#EC4899");
    private long   sessionStartMs  = 0;

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent == null || intent.getAction() == null) return START_STICKY;

        switch (intent.getAction()) {
            case ACTION_START:
                handleStart(intent);
                break;
            case ACTION_UPDATE:
                handleUpdate(intent);
                break;
            case ACTION_STOP:
                handleStop();
                break;
        }
        return START_STICKY;
    }

    // ── START ────────────────────────────────────────────────────────────────

    private void handleStart(Intent intent) {
        workName = intent.getStringExtra("workName");
        if (workName == null) workName = "Live Shift";

        String themeColorHex = intent.getStringExtra("themeColor");
        themeColorInt = parseColor(themeColorHex, Color.parseColor("#EC4899"));

        String sessionStartDate = intent.getStringExtra("sessionStartDate");
        sessionStartMs = parseIsoDate(sessionStartDate);

        createNotificationChannel();

        Notification notification = buildNotification(0, "$0.00", false, 0);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            startForeground(NOTIFICATION_ID, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_DATA_SYNC);
        } else {
            startForeground(NOTIFICATION_ID, notification);
        }
    }

    // ── UPDATE ───────────────────────────────────────────────────────────────

    private void handleUpdate(Intent intent) {
        int totalPausedSeconds = intent.getIntExtra("totalPausedSeconds", 0);
        String earningsFormatted = intent.getStringExtra("earningsFormatted");
        if (earningsFormatted == null) earningsFormatted = "$0.00";
        boolean isPaused = intent.getBooleanExtra("isPaused", false);

        // Frozen elapsed seconds when paused
        int frozenElapsedSeconds = 0;
        if (isPaused) {
            String pausedSinceStr = intent.getStringExtra("pausedSince");
            long pausedSinceMs = parseIsoDate(pausedSinceStr);
            if (pausedSinceMs > 0 && sessionStartMs > 0) {
                long elapsed = (pausedSinceMs - sessionStartMs) / 1000 - totalPausedSeconds;
                frozenElapsedSeconds = (int) Math.max(0, elapsed);
            }
        }

        Notification notification = buildNotification(totalPausedSeconds, earningsFormatted, isPaused, frozenElapsedSeconds);
        NotificationManager nm = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        nm.notify(NOTIFICATION_ID, notification);
    }

    // ── STOP ─────────────────────────────────────────────────────────────────

    private void handleStop() {
        stopForeground(true);
        stopSelf();
    }

    // ── NOTIFICATION BUILDER ─────────────────────────────────────────────────

    private Notification buildNotification(int totalPausedSeconds, String earningsFormatted, boolean isPaused, int frozenElapsedSeconds) {
        // Open the app when tapping the notification
        Intent openIntent = new Intent(this, MainActivity.class);
        openIntent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent pendingOpen = PendingIntent.getActivity(
            this, 0, openIntent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_notification)
            .setColor(themeColorInt)
            .setOngoing(true)
            .setOnlyAlertOnce(true)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setContentIntent(pendingOpen)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT);

        // Colorized background (API 26+) — makes the notification card use the theme color
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            builder.setColorized(true);
        }

        if (isPaused) {
            // Frozen state: show static elapsed time
            String frozenTime = formatSeconds(frozenElapsedSeconds);
            builder
                .setContentTitle("⏸  " + workName)
                .setContentText(frozenTime + "  ·  " + earningsFormatted)
                .setUsesChronometer(false);
        } else {
            // Active state: auto-updating chronometer counts up from adjusted base
            // setWhen(sessionStart + totalPausedMs) → chronometer shows (now - when) = active elapsed
            long totalPausedMs = totalPausedSeconds * 1000L;
            long chronometerBase = sessionStartMs > 0
                ? SystemClock.elapsedRealtime() - (System.currentTimeMillis() - sessionStartMs - totalPausedMs)
                : SystemClock.elapsedRealtime();

            builder
                .setContentTitle("●  " + workName)
                .setContentText(earningsFormatted)
                .setUsesChronometer(true)
                .setWhen(chronometerBase)
                .setChronometerCountDown(false);
        }

        return builder.build();
    }

    // ── NOTIFICATION CHANNEL ─────────────────────────────────────────────────

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                CHANNEL_NAME,
                NotificationManager.IMPORTANCE_DEFAULT
            );
            channel.setDescription("Live Mode active shift tracking");
            channel.setSound(null, null); // no sound for live updates
            NotificationManager nm = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
            nm.createNotificationChannel(channel);
        }
    }

    // ── HELPERS ──────────────────────────────────────────────────────────────

    private int parseColor(String hex, int fallback) {
        if (hex == null || hex.isEmpty()) return fallback;
        try {
            return Color.parseColor(hex.startsWith("#") ? hex : "#" + hex);
        } catch (Exception e) {
            return fallback;
        }
    }

    private long parseIsoDate(String isoString) {
        if (isoString == null || isoString.isEmpty()) return 0;
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US);
            sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
            Date date = sdf.parse(isoString);
            return date != null ? date.getTime() : 0;
        } catch (ParseException e) {
            try {
                // Fallback without milliseconds
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.US);
                sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
                Date date = sdf.parse(isoString);
                return date != null ? date.getTime() : 0;
            } catch (ParseException e2) {
                return 0;
            }
        }
    }

    private String formatSeconds(int totalSeconds) {
        int h = totalSeconds / 3600;
        int m = (totalSeconds % 3600) / 60;
        int s = totalSeconds % 60;
        return String.format(Locale.US, "%02d:%02d:%02d", h, m, s);
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
