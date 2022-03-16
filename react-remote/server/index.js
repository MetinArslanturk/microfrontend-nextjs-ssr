require('ignore-styles')

require('@babel/register')({
  ignore: [/(node_modules)/],
  presets: ['@babel/preset-env', '@babel/preset-react']
})

const PORT = process.env.PORT || 3003;

const app = require('./server').default;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});