/** Introduces the non-commercial marketplace demo on the home page. */
export function Welcome() {
  return (
    <main className="welcome">
      <div className="welcome__content">
        <p className="welcome__notice">Demo store, sandbox payments</p>
        <p className="welcome__brand">Sawdagar Dokanpat</p>
        <h1>Every dokan, one marketplace.</h1>
        <p className="welcome__description">
          A marketplace demo inspired by the independent makers and merchants of Bangladesh.
        </p>
        <div className="welcome__bangla" lang="bn">
          <p className="welcome__brand">সওদাগর দোকানপাট</p>
          <p>বাংলাদেশের স্বাধীন কারিগর ও ব্যবসায়ীদের অনুপ্রেরণায় একটি বাজারের ডেমো।</p>
          <p>ডেমো দোকান, পরীক্ষামূলক পেমেন্ট।</p>
        </div>
        <a href="https://github.com/ibrahimSumon47/sawdagar-dokanpart">
          Explore the project on GitHub <span aria-hidden="true">↗</span>
        </a>
      </div>
    </main>
  );
}
