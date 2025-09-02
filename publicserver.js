const express = require("express");
const HMfull = require("hmfull");

const app = express();


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // разрешить всем
  next();
});

app.use(express.static('public'));

// Маршрут

app.get('/tags', async (req,res) => {
  try {
    const respond = await HMfull;
    const tags = {
      HMtai: {
      sfw: Object.keys(respond.HMtai.sfw),
      nsfw: Object.keys(respond.HMtai.nsfw),
      },
      NekoBot: {
        sfw: Object.keys(respond.NekoBot.sfw),
        nsfw: Object.keys(respond.NekoBot.nsfw),
      },
      NekoLove: {
        sfw: Object.keys(respond.NekoLove.sfw),
        nsfw: Object.keys(respond.NekoLove.nsfw),
      },
      Nekos: {
        sfw: Object.keys(respond.Nekos.sfw),
        nsfw: Object.keys(respond.Nekos.nsfw),
      }
    };
    res.json(tags);
    //Мы не можем спарсить HMfull теги полностью, поэтому приходится прибегать к такому костылю в лице обьекта. 
    // Почему? Потому что возвращаемый обьект скрывает обьект с тегами, из-за того что значение ключа (тега) имеет 
    // анонимную функцию. Разработчик сделал это для того, чтобы не спалить REST API юрл адрес.
  }
  catch (error) {
    res.status(500).json({ error: 'Ошибка при получении данных с сервера.'})
  }
});

for (let [api, categories] of Object.entries(HMfull)) {
  for (let [category, tags] of Object.entries(categories)) {
    for (let [tag,funct] of Object.entries(tags)) {
      const currentPath = `/${api}/${category}/${tag}`;
      app.get(currentPath, async (req,res) => {
        try {
          const data = await funct();
          res.json({ url: data.url });
        }
        catch (error) {
          res.status(500).json({ error: `Ошибка при получении ${tag}` });
        }
      });
    }
  }
}
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Сервер запущен"));