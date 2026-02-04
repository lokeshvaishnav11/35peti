import React, { useEffect, useState } from "react";
import betService from "../../services/bet.service";

const TvSettings = () => {
  const [tvOptions, setTvOptions] = useState({
    casinoTv: false,
    sportTv: false,
  });

  const [loading, setLoading] = useState(true);

  // 🔥 FIRST CALL – get current status
  useEffect(() => {
    const fetchTvStatus = async () => {
      try {
        const res = await betService.tvStatus();

        // backend se: { ctv: true, stv: false }
        setTvOptions({
          casinoTv: res.data.data.ctv ?? false,
          sportTv: res.data.data.stv ?? false,
        });
      } catch (error) {
        console.error("Failed to fetch TV status", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTvStatus();
  }, []);

  // 🔄 Update on checkbox toggle
  const handleChange = async (e: any) => {
    const { name, checked } = e.target;

    const updatedData = {
      ...tvOptions,
      [name]: checked,
    };

    setTvOptions(updatedData);

    try {
      await betService.updateTV({
        type: name,     // casinoTv | sportTv
        value: checked, // true | false
      });
    } catch (error) {
      console.error("Update TV failed", error);
    }
  };

  if (loading) {
    return <div style={{ textAlign: "center" }}>Loading TV settings...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>TV Settings</h2>

      <label style={styles.option}>
        <input
          type="checkbox"
          name="casinoTv"
          checked={tvOptions.casinoTv}
          onChange={handleChange}
        />
        <span style={styles.label}>Casino TV</span>
      </label>

      <label style={styles.option}>
        <input
          type="checkbox"
          name="sportTv"
          checked={tvOptions.sportTv}
          onChange={handleChange}
        />
        <span style={styles.label}>Sport TV</span>
      </label>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "40px auto",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    background: "#fff",
  },
  heading: {
    marginBottom: "20px",
  },
  option: {
    display: "flex",
    alignItems: "center",
    marginBottom: "15px",
    fontSize: "16px",
    cursor: "pointer",
  },
  label: {
    marginLeft: "10px",
  },
};

export default TvSettings;
