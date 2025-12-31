## 🎨 Let's Compare Them Side by Side
```
CALLBACKS:                 PROMISES:                  ASYNC/AWAIT:
-----------                ----------                 -------------
Read file                  Read file                  Read file
  └─ When done:              .then(                     await (wait here!)
      Add 10                   Add 10                   Add 10
      Write file                 Write file              Write file
        └─ When done:            .then(                  await (wait here!)
            Celebrate!             Celebrate!)           Celebrate!
```

---

## 🧩 Understanding "Await"

Think of `await` like a pause button:

**Without await:**
```
Hey, start reading the file!
Add 10 to... wait, what number? We don't have it yet! ❌
```

**With await:**
```
Hey, start reading the file!
*pause and wait...*
Got it! The number is 5!
Now add 10 = 15 ✅