package moe.yzf.bcm.shell;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.view.View;
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

public class MainActivity extends AppCompatActivity {

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
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        
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
                progressBar.setVisibility(View.GONE);
                
                // Auto-click play button for kitten4
                autoClickPlayButton();
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
        });

        // Load the work from assets
        loadWork();
    }

    private void loadWork() {
        // Try to load work from assets/works/index.html
        // This will be replaced with actual work files during packaging
        webView.loadUrl("file:///android_asset/works/index.html");
    }

    private WebResourceResponse handleAssetRequest(String url) {
        try {
            // Extract the path after "file:///android_asset/"
            String path = url.substring("file:///android_asset/".length());
            
            // Try to open the asset
            InputStream inputStream = getAssets().open(path);
            
            // Determine MIME type based on file extension
            String mimeType = getMimeType(path);
            
            return new WebResourceResponse(mimeType, "UTF-8", inputStream);
        } catch (IOException e) {
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
