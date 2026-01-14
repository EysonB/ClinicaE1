import { useNavigate } from "react-router-dom";

export default function NavButtons() {
  const navigate = useNavigate();

  return (
    <div style={{ marginBottom: "20px" }}>
      <button onClick={() => navigate("/")}>
        Inicio
      </button>

      <button onClick={() => navigate(-1)} style={{ marginLeft: "10px" }}>
        Volver
      </button>
    </div>
  );
}
