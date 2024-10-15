import styles from "../styles/Home.module.css";
import TextAdventureGame from "./TextAdventureGame";

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <TextAdventureGame />
      </main>
    </div>
  );
}
