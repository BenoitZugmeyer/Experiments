import java.util.Scanner;
import java.io.BufferedReader;
import java.io.InputStreamReader;

public class exec {

    public static void main(String[] args) {
        String[] execArgs = {"bash", "-c", "echo Hi"};
        try {
            Process p = Runtime.getRuntime().exec(execArgs);
            int code = p.waitFor();
            InputStreamReader reader = new InputStreamReader(p.getInputStream());
            Scanner s = new java.util.Scanner(reader).useDelimiter("\\A");
            System.out.print(code + " " + (s.hasNext() ? s.next() : ""));
        } catch (Exception e) {
            System.out.println("Exception: " + e.getMessage());
        }

    }

}
