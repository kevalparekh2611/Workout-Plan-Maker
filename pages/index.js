import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [age, setAge] = useState(20);
  const [gender, setGender] = useState("Male");
  const [aim, setAim] = useState("Gain Muscles");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ age: age, gender: gender, aim: aim }),
      });
      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }
      setResult(data.result.replaceAll("\n", "<br />"));
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
    setLoading(false);
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <h3>Workout Plan Maker</h3>
        <form onSubmit={onSubmit}>
          <label>Age</label>
          <input
            type="number"
            name="age"
            placeholder="Enter your age"
            value={age}
            onChange={(e) => setAge(Number.parseInt(e.target.value))}
          />
          <label>
            <input
              type="radio"
              value="Male"
              checked={gender === "Male"}
              onChange={(e) => setGender(e.target.value)}
            />
            Male
          </label>
          <label>
            <input
              type="radio"
              value="Female"
              checked={gender === "Female"}
              onChange={(e) => setGender(e.target.value)}
            />
            Female
          </label>
          <label>Aim</label>
          <select
            value={aim}
            onChange={(e) => {
              setAim(e.target.value);
            }}
          >
            <option value="Gain Muscles">Gain Muscles</option>
            <option value="Reduce weight">Reduce weight</option>
          </select>
          <input type="submit" value="Create Plan" />
        </form>
        {loading && (
          <div>
            <h4>Please wait while we create a good plan for you ... </h4>
          </div>
        )}
        {result && (
          <div>
            <h4> Your Plan : </h4>
            <div
              className={styles.result}
              dangerouslySetInnerHTML={{ __html: result }}
            />
          </div>
        )}
      </main>
    </div>
  );
}
