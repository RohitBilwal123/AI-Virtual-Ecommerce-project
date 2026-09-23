import { useState } from "react";
import "./BodyProfile.css";

function BodyProfile({ customer }) {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [chest, setChest] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [shoulder, setShoulder] = useState("");
  const [saved, setSaved] = useState(false);

  const saveProfile = async () => {
    if (!customer) {
      alert("Please save customer details first.");
      return;
    }

    if (
      !height ||
      !weight ||
      !chest ||
      !waist ||
      !hip ||
      !shoulder
    ) {
      alert("Please enter all body measurements.");
      return;
    }

    const bodyProfile = {
      height: Number(height),
      weight: Number(weight),
      chest: Number(chest),
      waist: Number(waist),
      hip: Number(hip),
      shoulder: Number(shoulder),

      // Photo will be handled by Virtual Try-On.
      photoUrl: "",

      customer: {
        id: customer.id,
      },
    };

    try {
      const response = await fetch(
        "http://localhost:8081/api/body-profiles",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyProfile),
        }
      );

      if (!response.ok) {
        throw new Error("Body profile creation failed");
      }

      await response.json();

      setSaved(true);

      alert("Body profile saved successfully!");
    } catch (error) {
      console.error("Body profile error:", error);

      alert("Failed to save body profile.");
    }
  };

  return (
    <section className="body-profile-card">
      <div className="body-profile-heading">
        <div className="body-profile-icon">
          🧍
        </div>

        <div>
          <h2>Create Your Body Profile</h2>

          <p>
            Enter your measurements for personalized
            AI experiences.
          </p>
        </div>
      </div>

      {!customer && (
        <div className="body-profile-warning">
          Please save customer details before creating
          your body profile.
        </div>
      )}

      <div className="body-profile-content">

        {/* Photo information */}
        <div className="body-photo-section">
          <div className="photo-placeholder">
            🧍
          </div>

          <p>
            Upload your photo in the{" "}
            <strong>AI Virtual Try-On</strong>{" "}
            section below.
          </p>
        </div>

        {/* Body measurements */}
        <div className="body-measurements">

          <div className="measurement-field">
            <label>Height (cm)</label>

            <input
              type="number"
              value={height}
              onChange={(e) =>
                setHeight(e.target.value)
              }
              placeholder="170"
            />
          </div>

          <div className="measurement-field">
            <label>Weight (kg)</label>

            <input
              type="number"
              value={weight}
              onChange={(e) =>
                setWeight(e.target.value)
              }
              placeholder="65"
            />
          </div>

          <div className="measurement-field">
            <label>Chest (cm)</label>

            <input
              type="number"
              value={chest}
              onChange={(e) =>
                setChest(e.target.value)
              }
              placeholder="92"
            />
          </div>

          <div className="measurement-field">
            <label>Waist (cm)</label>

            <input
              type="number"
              value={waist}
              onChange={(e) =>
                setWaist(e.target.value)
              }
              placeholder="80"
            />
          </div>

          <div className="measurement-field">
            <label>Hip (cm)</label>

            <input
              type="number"
              value={hip}
              onChange={(e) =>
                setHip(e.target.value)
              }
              placeholder="94"
            />
          </div>

          <div className="measurement-field">
            <label>Shoulder (cm)</label>

            <input
              type="number"
              value={shoulder}
              onChange={(e) =>
                setShoulder(e.target.value)
              }
              placeholder="44"
            />
          </div>

          <button
            className="save-body-profile"
            onClick={saveProfile}
            disabled={!customer}
          >
            🧍 Save Body Profile
          </button>

        </div>
      </div>

      {saved && (
        <div className="body-profile-success">
          ✓ Body profile saved successfully
        </div>
      )}
    </section>
  );
}

export default BodyProfile;