// Helper para gerar URLs de imagens 360° mockadas
// Em produção, estas seriam imagens reais capturadas em 360°

export const generate360Images = (productId, baseImage) => {
  // Simular 36 frames (10 graus cada) para uma rotação 360°
  const totalFrames = 36;
  const frames = [];

  // Para demo, vamos usar a mesma imagem base
  // Em produção, cada frame seria uma foto diferente do produto
  for (let i = 0; i < totalFrames; i++) {
    frames.push(baseImage);
  }

  return frames;
};

// Produtos que possuem visualização 360°
export const products360 = {
  1: true,  // Prancha de Surf Pro
  2: true,  // Shape Profissional
  3: true,  // Longboard Cruiser
  4: false, // Camiseta (vestuário não tem 360)
  5: false, // Bermuda
  6: true,  // Óculos de Sol
  7: false, // Boné
  8: true,  // Mochila Impermeável
  9: true,  // Deck Premium
  10: true, // Rodas High Performance
};

export const has360View = (productId) => {
  return products360[productId] || false;
};
