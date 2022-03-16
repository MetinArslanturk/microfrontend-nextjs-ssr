const app = require('../server-dist/main').default;

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });