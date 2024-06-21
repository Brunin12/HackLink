"use strict";

const baseUrl = window.location.origin;
const imageList = $("#imageList");

$(document).ready(function () {
  async function deleteAll() {
    $.post(`${baseUrl}/apagarDados`, null, fetchImages);
    toastr.success(`Dados excluídos com sucesso.` );
  }

  // Define a função para buscar imagens
  async function fetchImages() {
    try {
      const response = await fetch("/images");
      const images = await response.json();
      const imageList = $("#imageList");
      imageList.empty();
      if (images.length <= 0) {
        imageList.append("<div class='alert alert-info w-100'>Nenhum Item encontrado</div>");
      } else {
        images.forEach((image) => {
          const imgColumn = $("<div>").addClass("col-md-3 image-column");
          const img = $("<img>")
            .attr({
              src: image.path, // Corrigido para usar image.path em vez de image
              alt: "Imagem Recebida",
              "data-id": image.id,
            })
            .addClass("img-fluid rounded");
          imgColumn.append(img);
  
          // Ícones de maximizar e excluir
          const icons = $("<div>").addClass("image-icons");
  
          const maximizeIcon = $("<i>")
            .addClass("fas fa-expand")
            .css("marginRight", "5px");
          maximizeIcon.click(function () {
            // Lógica para maximizar ou desmaximizar a imagem
            if (
              img.css("width") === "100%" ||
              img.css("position") === "fixed"
            ) {
              // Desmaximiza a imagem
              img.css({
                width: "",
                height: "",
                position: "",
                top: "",
                left: "",
                transform: "",
                zIndex: "",
              });
              $("body").css("overflow", "");
            } else {
              // Maximiza a imagem
              img.css({
                width: "100%",
                height: "auto",
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: "99999",
              });
              $("body").css("overflow", "hidden");
            }
          });
          icons.append(maximizeIcon);
  
          const deleteIcon = $("<i>").addClass("fas fa-trash-alt");
          deleteIcon.click(function () {
            // Lógica para excluir a imagem
            const imageId = img.data("id");
            imgColumn.remove();
            $.post(`${baseUrl}/delete/${imageId}`, () => {
              toastr.success(`Imagem excluída com sucesso.` );
            });
          });
          icons.append(deleteIcon);
  
          imgColumn.append(icons);
  
          imageList.append(imgColumn);
        });
      }
    } catch (error) {
      console.error("Erro ao buscar imagens:", error);
      toastr.error(
        "Erro ao buscar imagens. Por favor, tente novamente mais tarde."
      );
    }
  }
  
  // Chama a função fetchImages quando o documento estiver pronto
  $(document).ready(function () {
    imageList.hide();
    fetchImages();
    imageList.fadeIn(2000);

    setInterval(fetchImages, 2000);
  });

  $("#atualizar").click(() => {
    imageList.hide();
    fetchImages();
    imageList.fadeIn(2000);
  });

  $("#apagarDados").click(deleteAll);
});
