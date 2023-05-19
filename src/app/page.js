import styles from './page.module.css'
import MyComponent from './get.js'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <div>
          <MyComponent/>
        </div>
      </div>
    </main>
  )
}
