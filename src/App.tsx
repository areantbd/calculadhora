import "./App.css";
import { useState, useRef } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

function App() {
  // Modo claro/oscuro
  const [mode, setMode] = useState<"light" | "dark">("dark");
  const theme = createTheme({
    palette: {
      mode,
      background: {
        default:
          mode === "dark"
            ? "linear-gradient(135deg, #232526 0%, #414345 100%)"
            : "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)",
        paper: mode === "dark" ? "#232526" : "#fff",
      },
      primary: {
        main: mode === "dark" ? "#90caf9" : "#1976d2",
      },
      secondary: {
        main: mode === "dark" ? "#f48fb1" : "#9c27b0",
      },
    },
    shape: {
      borderRadius: 16,
    },
    // No MuiBox custom style here
  });
  const [inputs, setInputs] = useState(["", "", ""]);
  const [result, setResult] = useState<{
    hhmm: string;
    decimal: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Para depuración visual
  const [debugInputs, setDebugInputs] = useState<string[]>([]);
  const [debugFormatted, setDebugFormatted] = useState<string[]>([]);

  // Formatea 4 dígitos a HH:MM
  const autoFormat = (raw: string) => {
    let clean = raw.replace(/[^\d]/g, "");
    if (clean.length !== 4) return raw;
    let h = clean.slice(0, 2);
    let m = clean.slice(2, 4);
    if (Number(m) > 59) m = "59";
    return `${h}:${m}`;
  };

  const handleInputChange = (index: number, value: string) => {
    // Solo dígitos, máximo 4
    let clean = value.replace(/[^\d]/g, "").slice(0, 4);
    const newInputs = [...inputs];
    newInputs[index] = clean;
    setInputs(newInputs);
    // Salto automático si se completan 4 dígitos
    if (clean.length === 4 && inputRefs.current[index + 1]) {
      setTimeout(() => inputRefs.current[index + 1]?.focus(), 0);
    }
  };

  // Al salir del input, formatear a HH:MM solo si hay 4 dígitos
  const handleInputBlur = (index: number, value: string) => {
    let clean = value.replace(/[^\d]/g, "");
    // Siempre forzar formato HH:MM si hay 4 dígitos, si no, dejar vacío
    const formatted = clean.length === 4 ? autoFormat(clean) : "";
    const newInputs = [...inputs];
    newInputs[index] = formatted;
    setInputs(newInputs);
  };

  const addInput = () => setInputs([...inputs, ""]);
  const removeInput = (index: number) => {
    if (inputs.length === 1) return;
    setInputs(inputs.filter((_, i) => i !== index));
  };

  function sumTimes(times: string[]): { hhmm: string; decimal: string } | null {
    let totalMinutes = 0;
    let anyValid = false;
    for (const t of times) {
      if (!t) continue;
      let val = t;
      // Solo aceptar HH:MM con dos dígitos en la hora
      if (/^\d{4}$/.test(val)) {
        val = autoFormat(val);
      }
      if (!/^\d{2}:\d{2}$/.test(val)) continue;
      const [h, m] = val.split(":").map(Number);
      if (!isNaN(h) && !isNaN(m)) {
        totalMinutes += h * 60 + m;
        anyValid = true;
      }
    }
    if (!anyValid) return null;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const decimal = (totalMinutes / 60).toFixed(2);
    return {
      hhmm: `${hours}:${minutes.toString().padStart(2, "0")}`,
      decimal,
    };
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    // Guardar para depuración visual
    setDebugInputs([...inputs]);
    // Forzar todos los inputs a HH:MM si tienen 4 dígitos, si no, vacío
    const formattedInputs = inputs.map((val) => {
      let clean = val.replace(/[^\d]/g, "");
      if (clean.length === 4) return autoFormat(clean);
      return "";
    });
    setDebugFormatted(formattedInputs);
    const res = sumTimes(formattedInputs);
    if (!res) {
      setResult(null);
      setError(
        "Ningún campo tiene un valor válido en formato HH:MM (por ejemplo, 0015 se convierte a 00:15)"
      );
    } else {
      setResult(res);
      setInputs(formattedInputs);
    }
  };

  // Referencias para salto automático
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          width: "100vw",
          background: theme.palette.background.default,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.3s",
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 420,
            minWidth: 0,
            mx: "auto",
            my: 2,
            p: { xs: 2, sm: 4 },
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 6,
            position: "relative",
            maxHeight: { xs: "90vh", sm: 600 },
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            boxSizing: "border-box",
          }}
        >
          <IconButton
            onClick={() => setMode(mode === "light" ? "dark" : "light")}
            sx={{ position: "absolute", top: 12, right: 12 }}
            color="inherit"
            aria-label="toggle theme"
          >
            {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <Box
            component="h2"
            sx={{
              mb: 2,
              fontWeight: 600,
              fontSize: 26,
              textAlign: "center",
              letterSpacing: 1,
            }}
          >
            CalculadHora
          </Box>
          <Box component="form" onSubmit={handleSubmit} autoComplete="off">
            {inputs.map((value, idx) => (
              <Box
                key={idx}
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <TextField
                  inputRef={(el) => (inputRefs.current[idx] = el)}
                  variant="outlined"
                  size="small"
                  placeholder="HH:MM"
                  value={value}
                  onChange={(e) => handleInputChange(idx, e.target.value)}
                  onBlur={(e) => handleInputBlur(idx, e.target.value)}
                  inputProps={{
                    maxLength: 5, // Para HH:MM
                    style: { textAlign: "center", width: 80 },
                    inputMode: "text",
                    placeholder: "HHMM",
                  }}
                  sx={{ flex: 1 }}
                />
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => removeInput(idx)}
                  disabled={inputs.length === 1}
                  sx={{ minWidth: 32, px: 0 }}
                >
                  -
                </Button>
                {idx === inputs.length - 1 && (
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={addInput}
                    sx={{ minWidth: 32, px: 0 }}
                  >
                    +
                  </Button>
                )}
              </Box>
            ))}
            <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setInputs(["", "", ""]);
                  setResult(null);
                }}
                sx={{ flex: 1, fontWeight: 500, borderRadius: 2 }}
              >
                Limpiar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ flex: 2, fontWeight: 600, borderRadius: 2, boxShadow: 3 }}
              >
                Calcular
              </Button>
            </Box>
            {/* Debug visual: mostrar los valores de entrada y formateados dentro del formulario */}
          </Box>
          {error && (
            <Box
              sx={{
                mt: 2,
                color: "#e53935",
                textAlign: "center",
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              {error}
            </Box>
          )}
          {result && (
            <Box
              sx={{
                mt: 3,
                bgcolor: mode === "dark" ? "#232526" : "#f4f4f4",
                borderRadius: 2,
                p: 2,
                textAlign: "center",
                boxShadow: 2,
              }}
            >
              <strong style={{ fontSize: 18 }}>Total:</strong>
              <Box sx={{ mt: 1, fontSize: 17 }}>
                HH:MM = <span style={{ fontWeight: 700 }}>{result.hhmm}</span>
              </Box>
              <Box sx={{ fontSize: 17 }}>
                Decimal ={" "}
                <span style={{ fontWeight: 700 }}>{result.decimal}</span>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
