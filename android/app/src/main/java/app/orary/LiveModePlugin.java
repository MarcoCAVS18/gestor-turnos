package app.orary;

import android.content.Intent;
import android.os.Build;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "LiveActivityPlugin")
public class LiveModePlugin extends Plugin {

    @PluginMethod
    public void isSupported(PluginCall call) {
        JSObject result = new JSObject();
        result.put("supported", true);
        call.resolve(result);
    }

    @PluginMethod
    public void startActivity(PluginCall call) {
        String workName = call.getString("workName", "Live Shift");
        String workColor = call.getString("workColor", "#EC4899");
        String themeColor = call.getString("themeColor", workColor);
        String sessionStartDate = call.getString("sessionStartDate", "");

        Intent intent = new Intent(getContext(), LiveModeService.class);
        intent.setAction(LiveModeService.ACTION_START);
        intent.putExtra("workName", workName);
        intent.putExtra("workColor", workColor);
        intent.putExtra("themeColor", themeColor);
        intent.putExtra("sessionStartDate", sessionStartDate);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            getContext().startForegroundService(intent);
        } else {
            getContext().startService(intent);
        }

        JSObject result = new JSObject();
        result.put("activityId", "android-live-mode");
        call.resolve(result);
    }

    @PluginMethod
    public void updateActivity(PluginCall call) {
        int totalPausedSeconds = call.getInt("totalPausedSeconds", 0);
        String earningsFormatted = call.getString("earningsFormatted", "$0.00");
        boolean isPaused = Boolean.TRUE.equals(call.getBoolean("isPaused", false));
        String pausedSince = call.getString("pausedSince", "");

        Intent intent = new Intent(getContext(), LiveModeService.class);
        intent.setAction(LiveModeService.ACTION_UPDATE);
        intent.putExtra("totalPausedSeconds", totalPausedSeconds);
        intent.putExtra("earningsFormatted", earningsFormatted);
        intent.putExtra("isPaused", isPaused);
        intent.putExtra("pausedSince", pausedSince);

        getContext().startService(intent);
        call.resolve();
    }

    @PluginMethod
    public void endActivity(PluginCall call) {
        Intent intent = new Intent(getContext(), LiveModeService.class);
        intent.setAction(LiveModeService.ACTION_STOP);
        getContext().startService(intent);
        call.resolve();
    }
}
