package moe.yzf.bcm.shell;

import android.annotation.SuppressLint;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.ConsoleMessage;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ProgressBar;

import androidx.appcompat.app.AppCompatActivity;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

public class MainActivity extends AppCompatActivity {

    private static final String TAG = "BCMShell";
    private WebView webView;
    private ProgressBar progressBar;
    private View rootLayout;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Window window = getWindow();
        window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS
                | WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION);
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        window.getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
        window.setStatusBarColor(Color.TRANSPARENT);
        window.setNavigationBarColor(Color.TRANSPARENT);

        setContentView(R.layout.activity_main);

        rootLayout = findViewById(R.id.rootLayout);
        webView = findViewById(R.id.webView);
        progressBar = findViewById(R.id.progressBar);

        int statusBarHeight = getStatusBarHeight();
        rootLayout.setPadding(0, statusBarHeight, 0, 0);

        // Configure WebView settings
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setCacheMode(WebSettings.LOAD_NO_CACHE);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setMediaPlaybackRequiresUserGesture(false);

        // Set custom User-Agent (append format-factory identifier)
        String defaultUserAgent = settings.getUserAgentString();
        settings.setUserAgentString(defaultUserAgent + " kitten4-format-factory");

        // Enable debugging for development
        WebView.setWebContentsDebuggingEnabled(true);

        // Add JS interface for real-time status bar color updates
        webView.addJavascriptInterface(new Object() {
            @JavascriptInterface
            public void onColorChanged(String color) {
                try {
                    int c = parseColor(color.replace("\"", "").trim());
                    runOnUiThread(() -> rootLayout.setBackgroundColor(c));
                } catch (Exception e) {
                    Log.e(TAG, "Failed to parse color from JS: " + color, e);
                }
            }
        }, "StatusBarBridge");

        // Set WebViewClient to handle local resources
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                // Keep all navigation within WebView
                return false;
            }

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();
                
                // Handle local asset requests
                if (url.startsWith("file:///android_asset/")) {
                    return handleAssetRequest(url);
                }
                
                return super.shouldInterceptRequest(view, request);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                Log.d(TAG, "Page finished loading: " + url);
                progressBar.setVisibility(View.GONE);
                
                updateStatusBarColor();
                injectScrollColorListener();
                
                autoClickPlayButton();
            }

            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                super.onReceivedError(view, errorCode, description, failingUrl);
                Log.e(TAG, "WebView error: " + errorCode + " - " + description + " - " + failingUrl);
            }
        });

        // Set WebChromeClient for progress and alerts
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                if (newProgress < 100) {
                    progressBar.setVisibility(View.VISIBLE);
                }
            }

            @Override
            public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
                Log.d(TAG, "Console [" + consoleMessage.messageLevel() + "] " + 
                      consoleMessage.sourceId() + ":" + consoleMessage.lineNumber() + 
                      " - " + consoleMessage.message());
                return true;
            }
        });

        // Load the work from assets
        loadWork();
    }

    private void loadWork() {
        // Try different player entry points
        // kitten3: kitten3/player.html
        // kitten4: kitten4/renderer/index.html
        // online: player.html (online loader)
        
        String targetUrl = null;
        
        // First try kitten3
        try {
            getAssets().open("kitten3/player.html");
            targetUrl = "file:///android_asset/kitten3/player.html";
            Log.d(TAG, "Loading kitten3 player");
        } catch (IOException e) {
            // kitten3 not found, try kitten4
        }
        
        // Try kitten4
        if (targetUrl == null) {
            try {
                getAssets().open("kitten4/renderer/index.html");
                targetUrl = "file:///android_asset/kitten4/renderer/index.html";
                Log.d(TAG, "Loading kitten4 player");
            } catch (IOException e) {
                // kitten4 not found, try online
            }
        }
        
        // Fallback to online loader
        if (targetUrl == null) {
            targetUrl = "file:///android_asset/player.html";
            Log.d(TAG, "Loading online player");
        }
        
        Log.d(TAG, "Loading URL: " + targetUrl);
        webView.loadUrl(targetUrl);
    }

    private WebResourceResponse handleAssetRequest(String url) {
        try {
            // Extract the path after "file:///android_asset/"
            String path = url.substring("file:///android_asset/".length());
            
            Log.d(TAG, "Handling asset request: " + path);
            
            // Try to open the asset
            InputStream inputStream = getAssets().open(path);
            
            // Determine MIME type based on file extension
            String mimeType = getMimeType(path);
            
            Log.d(TAG, "Serving asset: " + path + " as " + mimeType);
            
            // Create response with CORS headers to allow local file access
            WebResourceResponse response = new WebResourceResponse(mimeType, "UTF-8", inputStream);
            
            // Add CORS headers to allow cross-origin requests from file:// URLs
            Map<String, String> headers = new HashMap<>();
            headers.put("Access-Control-Allow-Origin", "*");
            headers.put("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            headers.put("Access-Control-Allow-Headers", "Content-Type, Authorization");
            response.setResponseHeaders(headers);
            
            return response;
        } catch (IOException e) {
            Log.e(TAG, "Asset not found: " + url + " - " + e.getMessage());
            // Asset not found, let WebView handle it
            return null;
        }
    }

    private String getMimeType(String path) {
        if (path.endsWith(".html") || path.endsWith(".htm")) {
            return "text/html";
        } else if (path.endsWith(".js")) {
            return "application/javascript";
        } else if (path.endsWith(".css")) {
            return "text/css";
        } else if (path.endsWith(".png")) {
            return "image/png";
        } else if (path.endsWith(".jpg") || path.endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (path.endsWith(".svg")) {
            return "image/svg+xml";
        } else if (path.endsWith(".json")) {
            return "application/json";
        } else if (path.endsWith(".wasm")) {
            return "application/wasm";
        }
        return "application/octet-stream";
    }

    private void autoClickPlayButton() {
        // Auto-click play button for kitten4 player
        String js = "(function() {" +
                "  var clickPlay = function() {" +
                "    var btn = document.querySelector('.CUI-player-cover-play-btn');" +
                "    if (btn) { btn.click(); return true; }" +
                "    return false;" +
                "  };" +
                "  if (!clickPlay()) {" +
                "    setTimeout(clickPlay, 1000);" +
                "    setTimeout(clickPlay, 2000);" +
                "  }" +
                "})();";
        
        webView.evaluateJavascript(js, null);
    }

    private static final String COLOR_DETECT_JS =
            "(function() { " +
            "  try { " +
            "    var el = document.elementFromPoint(window.innerWidth / 2, 10); " +
            "    if (el) { " +
            "      var p = el; " +
            "      while (p && p !== document.documentElement) { " +
            "        var bg = window.getComputedStyle(p).backgroundColor; " +
            "        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') return bg; " +
            "        p = p.parentElement; " +
            "      } " +
            "    } " +
            "    return window.getComputedStyle(document.body).backgroundColor || '#000000'; " +
            "  } catch(e) { return '#000000'; } " +
            "})()";

    private void updateStatusBarColor() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            webView.evaluateJavascript(COLOR_DETECT_JS, value -> {
                if (value != null && !value.equals("null")) {
                    try {
                        String colorStr = value.replace("\"", "").trim();
                        int color = parseColor(colorStr);
                        runOnUiThread(() -> rootLayout.setBackgroundColor(color));
                    } catch (Exception e) {
                        Log.e(TAG, "Failed to parse color: " + value, e);
                    }
                }
            });
        }
    }

    private void injectScrollColorListener() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            String js = "(function() { " +
                    "  var lastColor = ''; " +
                    "  function getColor() { " +
                    "    try { " +
                    "      var el = document.elementFromPoint(window.innerWidth / 2, 10); " +
                    "      if (el) { " +
                    "        var p = el; " +
                    "        while (p && p !== document.documentElement) { " +
                    "          var bg = window.getComputedStyle(p).backgroundColor; " +
                    "          if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') return bg; " +
                    "          p = p.parentElement; " +
                    "        } " +
                    "      } " +
                    "      return window.getComputedStyle(document.body).backgroundColor || '#000000'; " +
                    "    } catch(e) { return '#000000'; } " +
                    "  } " +
                    "  function sync() { " +
                    "    var c = getColor(); " +
                    "    if (c !== lastColor) { " +
                    "      lastColor = c; " +
                    "      StatusBarBridge.onColorChanged(c); " +
                    "    } " +
                    "  } " +
                    "  var ticking = false; " +
                    "  window.addEventListener('scroll', function() { " +
                    "    if (!ticking) { " +
                    "      requestAnimationFrame(function() { sync(); ticking = false; }); " +
                    "      ticking = true; " +
                    "    } " +
                    "  }, { passive: true }); " +
                    "  window.addEventListener('touchmove', function() { " +
                    "    if (!ticking) { " +
                    "      requestAnimationFrame(function() { sync(); ticking = false; }); " +
                    "      ticking = true; " +
                    "    } " +
                    "  }, { passive: true }); " +
                    "  new MutationObserver(sync).observe(document.body, { " +
                    "    childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] " +
                    "  }); " +
                    "})();";
            webView.evaluateJavascript(js, null);
        }
    }

    private int getStatusBarHeight() {
        int result = 0;
        int resourceId = getResources().getIdentifier("status_bar_height", "dimen", "android");
        if (resourceId > 0) {
            result = getResources().getDimensionPixelSize(resourceId);
        }
        return result;
    }

    private int parseColor(String colorStr) {
        if (colorStr.startsWith("#")) {
            return Color.parseColor(colorStr);
        }
        
        if (colorStr.startsWith("rgb(")) {
            String[] parts = colorStr.replace("rgb(", "").replace(")", "").split(",");
            if (parts.length >= 3) {
                int r = Integer.parseInt(parts[0].trim());
                int g = Integer.parseInt(parts[1].trim());
                int b = Integer.parseInt(parts[2].trim());
                return Color.rgb(r, g, b);
            }
        }
        
        if (colorStr.startsWith("rgba(")) {
            String[] parts = colorStr.replace("rgba(", "").replace(")", "").split(",");
            if (parts.length >= 4) {
                int r = Integer.parseInt(parts[0].trim());
                int g = Integer.parseInt(parts[1].trim());
                int b = Integer.parseInt(parts[2].trim());
                float a = Float.parseFloat(parts[3].trim());
                return Color.argb((int) (a * 255), r, g, b);
            }
        }
        
        return Color.BLACK;
    }

    @Override
    protected void onPause() {
        super.onPause();
        webView.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        webView.onResume();
    }

    @Override
    protected void onDestroy() {
        webView.destroy();
        super.onDestroy();
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
