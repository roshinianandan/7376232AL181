import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import ThemeRegistry from "./ThemeRegistry";
export const metadata = { title: "Campus Notifications" };
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeRegistry>
            {children}
          </ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
