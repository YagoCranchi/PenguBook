package github.yagocranchi.reservas.utils;

import java.net.HttpURLConnection;
import java.util.regex.Pattern;
import java.net.URI;
import java.net.URL;

public class URLValidator {
    private static final Pattern DOMAIN_PATTERN = Pattern.compile(".*\\.[a-zA-Z]{2,}$");

    public static boolean isValidURL(String url) {
        try {
            URI uri = new URI(url);
            
            if (uri.getScheme() == null || (!uri.getScheme().equals("http") && !uri.getScheme().equals("https"))) {
                return false;
            }

            if (uri.getHost() == null || !DOMAIN_PATTERN.matcher(uri.getHost()).matches()) {
                return false;
            }

            return isReachable(url);
        } catch (Exception e) {
            return false;
        }
    }

    private static boolean isReachable(String url) {
        try {
            HttpURLConnection connection = (HttpURLConnection) new URL(url).openConnection();
            connection.setRequestMethod("HEAD");
            connection.setConnectTimeout(5000);
            connection.setReadTimeout(5000);
            connection.connect();

            int statusCode = connection.getResponseCode();
            return statusCode >= 200 && statusCode < 400;
        } catch (Exception e) {
            return false;
        }
    }
}
