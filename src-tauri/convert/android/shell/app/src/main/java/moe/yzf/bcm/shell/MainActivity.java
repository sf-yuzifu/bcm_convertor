package moe.yzf.bcm.shell;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.webkit.ConsoleMessage;
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

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webView);
        progressBar = findViewById(R.id.progressBar);

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
                
                // Auto-click play button for kitten4
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
