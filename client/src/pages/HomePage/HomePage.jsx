// import styles from './Home.module.css';
// import RandomDuck from '../../components/RandomDuck/RandomDuck.jsx';


// const Home = () => {
//   return (
//     <div className={styles.home}>
//       <h1 className={styles.headline}>Duck It</h1>
//       <RandomDuck />
//     </div>
//   );
// };

// export default Home;
// במקום: import React, { useState } from 'react';
// תכתבי רק:
import { useState } from 'react';
import styles from './Home.module.css';
import CommentCard from '../../components/CommentCard/CommentCard';

const Home = () => {
  // נתוני דמה לבדיקת כל המצבים האפשריים
 const [comments, setComments] = useState([
    { 
      id: 1, 
      username: "@tzadika_1", 
      avatarUrl: "https://i.pravatar.cc/150?img=32", 
      time: "לפני 10 דק'", 
      text: "וואו, איזה תוכן מחזק ויפה! אהבתי מאוד.", 
      impact: 15,
      sentiment: "positive" 
    },
    { 
      id: 2, 
      username: "@angry_troll", 
      avatarUrl: "", 
      time: "לפני דקה", 
      // 👇 טקסט ארוך במיוחד לבדיקת הגלילה 👇
      text: "סרטון מזעזע ביותר!! אני לא מאמין שמישהו מעלה דבר כזה. זה פשוט בושה וחרפה לכל מי שצופה בזה. אני דורש שתמחקו את זה מיד! ועוד משהו - למה האלגוריתם מקפיץ לי את זה? זה ממש לא בסדר. אני מתכוון להתלונן על הערוץ הזה אם זה לא יורד תוך 5 דקות. תתביישו לכם! וגם התגובות פה לא לעניין בכלל. בקיצור - למחוק, לחסום, ולדווח!!! לא רוצה לראות את זה יותר בפיד שלי בחיים!!!! (בדיקת גלילה... בדיקת גלילה... האם זה עובד?) ועכשיו אני ממשיך לכתוב רק כדי שזה יהיה ממש ארוך ותוכלי לראות את פס הגלילה מופיע בצד. אם את קוראת את זה סימן שהגלילה עובדת מצוין! נמשיך עוד קצת: הנה עוד שורה של טקסט סתמי, ועוד אחת, ועוד אחת. זה אמור להספיק כדי למלא את הכרטיס ולהפעיל את ה-overflow-y שהגדרנו ב-CSS. אני סתם ממשיך לכתוב כדי לוודא שזה חורג מהגובה של 300 פיקסלים. יאללה, נראה לי שזה מספיק ארוך עכשיו.", 
      impact: -10,
      sentiment: "negative" 
    },
    { 
      id: 3, 
      username: "@new_user_123", 
      avatarUrl: "", 
      time: "עכשיו", 
      text: "איפה אפשר להירשם לעדכונים?", 
      impact: 0,
      sentiment: "neutral" 
    }
  ]);

  // פונקציית המחיקה שתעלים כרטיסים מהמסך
  const handleDelete = (idToDelete) => {
    console.log(`🗑️ מוחק כרטיס מספר: ${idToDelete}`);
    // משאירים ברשימה רק את מי ש*לא* נמחק
    setComments(comments.filter(c => c.id !== idToDelete));
  };

  const handleBlock = (user) => {
    alert(`⛔ המשתמש ${user} נחסם!`);
  };

  return (
    <div className={styles.home}>
      <h1 style={{ color: 'white', textAlign: 'center', marginBottom: '30px' }}>
        בדיקת כל המצבים ({comments.length})
      </h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          
          {/* לולאה שעוברת על הנתונים ומייצרת כרטיסים */}
          {comments.map((item) => (
            <CommentCard 
              key={item.id}
              username={item.username}
              avatarUrl={item.avatarUrl}
              time={item.time}
              text={item.text}
              impact={item.impact}
              sentiment={item.sentiment} 
              
              // חיבור הכפתורים לפונקציות
              onDelete={() => handleDelete(item.id)}
              onBlock={() => handleBlock(item.username)}
            />
          ))}

          {/* הודעה שמופיעה כשהכל נמחק */}
          {comments.length === 0 && (
            <div style={{ color: '#aaa', marginTop: '20px', textAlign: 'center' }}>
              <h3>✨ המסך נקי!</h3>
              <p>בדקת את כל הכרטיסים ומחקת את כולם בהצלחה.</p>
              <button 
                onClick={() => window.location.reload()}
                style={{ padding: '10px 20px', cursor: 'pointer', marginTop: '10px' }}
              >
                רענן דף להתחלה מחדש
              </button>
            </div>
          )}

      </div>
    </div>
  );
};

export default Home;