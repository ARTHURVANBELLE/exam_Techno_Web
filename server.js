import express from 'express';
import Television from './models/Task.js';
import Traduction from './models/Task.js';
import random from 'random'

const app = express();  // Déclaration de 'app' ici

app.use(express.static('C:/Users/Van Belle Arthur/OneDrive - ECAM/Documents/Passerelle/Techno_Web/LW3L-orm/display'));
app.use(express.urlencoded({ extended: true }));

var lastId;
var correctAns;
var falseAns;
var goodAnswer;

app.get("/change", async function (req, res) {
  const tradList = await Traduction.loadMany({ });

  res.render('addTrad.ejs', { tradList });
});

app.get("/", async function (req, res) {
    const tradList = await Traduction.loadMany({ });

    var idList = new Array;
    for (var word of tradList){
      idList[idList.length] = word.id;   
    }
    const randompick = await Traduction.load({ id: idList[random.int(0,idList.length-1)] });
    const randomWord = randompick.ndls;
    lastId = randompick.id;
    res.render('traduction.ejs', { randomWord, falseAns, correctAns, goodAnswer });
});

app.get("/destroy/:id", async function (req, res) {
  
  const trad = await Traduction.delete({ id: req.params.id });
  res.redirect('/change');
});

app.post('/add', async (req, res)=>{
  const { ndls, french } = req.body;
  const trad = new Traduction();

  trad.update({fr : french, ndls : ndls, rate : 0, attempt : 0});

  await trad.save();
  res.redirect('/change');
})

app.post('/verify', async (req, res)=>{
  const { answer } = req.body;
  const trad = new Traduction();
  var succesRate = 0;

  const correction = await Traduction.load({ id: lastId });
  var attempt = correction.attempt;
  var rate = correction.rate;
  attempt += 1;

  if (correction.fr == answer){
    rate +=100;
    correctAns = "Félicitations ! bonne réponse :";
  }
  else{
    succesRate = (rate);
    correctAns = "Mauvaise réponse, la bonne réponse était : ";
  }


  succesRate = rate/attempt;
  goodAnswer = (correction.fr);
  correction.update({id : correction.id, ndls : correction.ndls, fr : correction.fr,
     rate : parseInt(succesRate), attempt : attempt,});

  await correction.save();
  res.redirect('/');

})

app.post('/change1', async (req, res)=>{
  res.redirect('/');
})

app.post('/change2', async (req, res)=>{
  res.redirect('/change');
})

app.listen(80, () => {
    console.log('Serveur en cours d\'écoute sur le port 4000');
});
