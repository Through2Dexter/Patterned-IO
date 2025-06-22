import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const supabase = createClient(
  "https://jmjsrcmzxwkfgmnemdcw.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptanNyY216eHdrZmdtbmVtZGN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4MzYxMTcsImV4cCI6MjA1NzQxMjExN30.QEGUHDqQO3z7ZjDSyATHRCCkpL3Jgi_b_UppyGZnNE0",
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
