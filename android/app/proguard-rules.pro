# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Uncomment this to preserve the line number information for
# debugging stack traces.
#-keepattributes SourceFile,LineNumberTable

# If you keep the line number information, uncomment this to
# hide the original source file name.
#-renamesourcefileattribute SourceFile

# Keep line numbers for readable crash reports (file names stay hidden)
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# ── Capacitor ────────────────────────────────────────────────────────────────
# The Capacitor bridge discovers plugins and their @PluginMethod entry points
# via reflection — R8 must not strip or rename them.
-keep public class * extends com.getcapacitor.Plugin
-keep @com.getcapacitor.annotation.CapacitorPlugin public class * {
    @com.getcapacitor.annotation.PermissionCallback <methods>;
    @com.getcapacitor.annotation.ActivityCallback <methods>;
    @com.getcapacitor.PluginMethod public <methods>;
}
-keep public class * extends com.getcapacitor.BridgeActivity
-keep class com.getcapacitor.** { *; }
-keep class org.apache.cordova.** { *; }

# App's own Capacitor plugins (registered reflectively)
-keep class app.orary.LiveModePlugin { *; }
-keep class app.orary.LiveModeService { *; }

# AndroidX core (FileProvider is referenced from the manifest)
-keep class androidx.core.content.FileProvider { *; }
