import React, { createContext, useContext, useState, useEffect } from 'react';

const FAQContext = createContext();

export const useFAQ = () => {
  const context = useContext(FAQContext);
  if (!context) {
    throw new Error('useFAQ must be used within FAQProvider');
  }
  return context;
};

// Perguntas frequentes mockadas
const MOCK_FAQS = [
  // Envio e Entrega
  {
    id: 1,
    category: 'Envio e Entrega',
    question: 'Qual o prazo de entrega?',
    answer: 'O prazo de entrega varia conforme sua localização. Para o Sul e Sudeste, a entrega ocorre em 3-5 dias úteis. Para outras regiões, o prazo é de 7-10 dias úteis. Você receberá um código de rastreamento assim que o pedido for despachado.',
    views: 1245,
    helpful: 892,
    notHelpful: 45,
    tags: ['prazo', 'entrega', 'envio'],
  },
  {
    id: 2,
    category: 'Envio e Entrega',
    question: 'Quanto custa o frete?',
    answer: 'O frete é calculado automaticamente no carrinho com base no seu CEP e peso dos produtos. Oferecemos frete grátis para compras acima de R$ 299,00 para todo o Brasil.',
    views: 1050,
    helpful: 756,
    notHelpful: 32,
    tags: ['frete', 'custo', 'envio'],
  },
  {
    id: 3,
    category: 'Envio e Entrega',
    question: 'Como rastrear meu pedido?',
    answer: 'Após o envio, você receberá um e-mail com o código de rastreamento. Você também pode acompanhar o status do pedido na seção "Meus Pedidos" do seu perfil.',
    views: 890,
    helpful: 623,
    notHelpful: 28,
    tags: ['rastreamento', 'pedido', 'acompanhar'],
  },
  
  // Pagamento
  {
    id: 4,
    category: 'Pagamento',
    question: 'Quais formas de pagamento são aceitas?',
    answer: 'Aceitamos cartões de crédito (Visa, Mastercard, Elo, Amex), PIX, boleto bancário e parcelamento em até 10x sem juros no cartão de crédito.',
    views: 2100,
    helpful: 1543,
    notHelpful: 67,
    tags: ['pagamento', 'forma', 'cartão'],
  },
  {
    id: 5,
    category: 'Pagamento',
    question: 'Posso parcelar minha compra?',
    answer: 'Sim! Você pode parcelar em até 10x sem juros no cartão de crédito para compras acima de R$ 200,00. Para valores menores, o parcelamento é de até 3x sem juros.',
    views: 1567,
    helpful: 1204,
    notHelpful: 43,
    tags: ['parcelamento', 'cartão', 'juros'],
  },
  {
    id: 6,
    category: 'Pagamento',
    question: 'É seguro comprar no site?',
    answer: 'Sim, totalmente seguro! Utilizamos certificado SSL para criptografar todos os dados e trabalhamos com gateways de pagamento certificados. Seus dados estão protegidos.',
    views: 987,
    helpful: 854,
    notHelpful: 12,
    tags: ['segurança', 'ssl', 'proteção'],
  },

  // Trocas e Devoluções
  {
    id: 7,
    category: 'Trocas e Devoluções',
    question: 'Qual o prazo para trocas e devoluções?',
    answer: 'Você tem 30 dias a partir do recebimento do produto para solicitar troca ou devolução. O produto deve estar em perfeito estado, com etiquetas e embalagem original.',
    views: 1678,
    helpful: 1234,
    notHelpful: 89,
    tags: ['troca', 'devolução', 'prazo'],
  },
  {
    id: 8,
    category: 'Trocas e Devoluções',
    question: 'Como solicitar uma troca?',
    answer: 'Acesse "Meus Pedidos" no seu perfil, selecione o produto que deseja trocar e clique em "Solicitar Troca". Nossa equipe entrará em contato em até 24 horas.',
    views: 1234,
    helpful: 943,
    notHelpful: 56,
    tags: ['solicitar', 'troca', 'processo'],
  },
  {
    id: 9,
    category: 'Trocas e Devoluções',
    question: 'Quem paga o frete da troca?',
    answer: 'Se a troca for por defeito do produto ou erro nosso, o frete é por nossa conta. Em caso de arrependimento ou troca de tamanho, o frete é por conta do cliente.',
    views: 876,
    helpful: 654,
    notHelpful: 78,
    tags: ['frete', 'troca', 'custo'],
  },

  // Produtos
  {
    id: 10,
    category: 'Produtos',
    question: 'Como escolher o tamanho correto?',
    answer: 'Cada produto possui uma tabela de medidas detalhada na página. Recomendamos medir e comparar com as dimensões fornecidas. Em caso de dúvida, nossa equipe está disponível para ajudar.',
    views: 2345,
    helpful: 1876,
    notHelpful: 123,
    tags: ['tamanho', 'medidas', 'tabela'],
  },
  {
    id: 11,
    category: 'Produtos',
    question: 'Os produtos têm garantia?',
    answer: 'Sim! Todos os produtos possuem 90 dias de garantia contra defeitos de fabricação, além da garantia do fabricante quando aplicável.',
    views: 1456,
    helpful: 1123,
    notHelpful: 67,
    tags: ['garantia', 'defeito', 'fabricante'],
  },
  {
    id: 12,
    category: 'Produtos',
    question: 'Quando os produtos voltam ao estoque?',
    answer: 'Produtos esgotados geralmente retornam ao estoque em 15-30 dias. Você pode cadastrar seu e-mail na página do produto para ser notificado quando ele voltar.',
    views: 1098,
    helpful: 789,
    notHelpful: 98,
    tags: ['estoque', 'disponibilidade', 'notificação'],
  },

  // Conta e Pedidos
  {
    id: 13,
    category: 'Conta e Pedidos',
    question: 'Como criar uma conta?',
    answer: 'Click em "Entrar" no menu superior e depois em "Criar Conta". Preencha seus dados e pronto! Você também pode criar uma conta durante o checkout.',
    views: 756,
    helpful: 623,
    notHelpful: 23,
    tags: ['conta', 'cadastro', 'registro'],
  },
  {
    id: 14,
    category: 'Conta e Pedidos',
    question: 'Esqueci minha senha, o que fazer?',
    answer: 'Na página de login, click em "Esqueci minha senha". Digite seu e-mail e você receberá instruções para criar uma nova senha.',
    views: 654,
    helpful: 543,
    notHelpful: 34,
    tags: ['senha', 'recuperar', 'esquecer'],
  },
  {
    id: 15,
    category: 'Conta e Pedidos',
    question: 'Posso cancelar meu pedido?',
    answer: 'Sim, você pode cancelar seu pedido enquanto ele estiver com status "Processando". Após o envio, não é possível cancelar, mas você pode solicitar devolução após receber.',
    views: 1432,
    helpful: 1087,
    notHelpful: 112,
    tags: ['cancelar', 'pedido', 'status'],
  },
];

export const FAQProvider = ({ children }) => {
  const [faqs, setFaqs] = useState(MOCK_FAQS);
  const [userFeedback, setUserFeedback] = useState({});

  // Carregar feedback do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('faq_feedback');
    if (saved) {
      try {
        setUserFeedback(JSON.parse(saved));
      } catch (error) {
        console.error('Erro ao carregar feedback:', error);
      }
    }
  }, []);

  // Salvar feedback
  const saveFeedback = (feedback) => {
    localStorage.setItem('faq_feedback', JSON.stringify(feedback));
    setUserFeedback(feedback);
  };

  // Buscar todas as FAQs
  const getAllFAQs = () => {
    return faqs.sort((a, b) => b.views - a.views);
  };

  // Buscar por categoria
  const getByCategory = (category) => {
    if (!category || category === 'all') return faqs;
    return faqs.filter((faq) => faq.category === category);
  };

  // Buscar FAQs (por pergunta, resposta ou tags)
  const searchFAQs = (query) => {
    if (!query || query.trim() === '') return faqs;
    
    const lowerQuery = query.toLowerCase();
    return faqs.filter((faq) => {
      return (
        faq.question.toLowerCase().includes(lowerQuery) ||
        faq.answer.toLowerCase().includes(lowerQuery) ||
        faq.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    });
  };

  // Buscar mais vistas
  const getMostViewed = (limit = 5) => {
    return [...faqs].sort((a, b) => b.views - a.views).slice(0, limit);
  };

  // Buscar mais úteis
  const getMostHelpful = (limit = 5) => {
    return [...faqs]
      .sort((a, b) => {
        const ratioA = a.helpful / (a.helpful + a.notHelpful);
        const ratioB = b.helpful / (b.helpful + b.notHelpful);
        return ratioB - ratioA;
      })
      .slice(0, limit);
  };

  // Registrar visualização
  const registerView = (faqId) => {
    setFaqs((prev) =>
      prev.map((faq) =>
        faq.id === faqId ? { ...faq, views: faq.views + 1 } : faq
      )
    );
  };

  // Marcar como útil
  const markAsHelpful = (faqId) => {
    // Verificar se já votou
    if (userFeedback[faqId]) return false;

    setFaqs((prev) =>
      prev.map((faq) =>
        faq.id === faqId ? { ...faq, helpful: faq.helpful + 1 } : faq
      )
    );

    const newFeedback = { ...userFeedback, [faqId]: 'helpful' };
    saveFeedback(newFeedback);
    return true;
  };

  // Marcar como não útil
  const markAsNotHelpful = (faqId) => {
    // Verificar se já votou
    if (userFeedback[faqId]) return false;

    setFaqs((prev) =>
      prev.map((faq) =>
        faq.id === faqId ? { ...faq, notHelpful: faq.notHelpful + 1 } : faq
      )
    );

    const newFeedback = { ...userFeedback, [faqId]: 'not_helpful' };
    saveFeedback(newFeedback);
    return true;
  };

  // Verificar se já votou
  const hasVoted = (faqId) => {
    return !!userFeedback[faqId];
  };

  // Buscar voto do usuário
  const getUserVote = (faqId) => {
    return userFeedback[faqId] || null;
  };

  // Listar categorias
  const getCategories = () => {
    const categories = [...new Set(faqs.map((faq) => faq.category))];
    return categories.map((cat) => ({
      name: cat,
      count: faqs.filter((faq) => faq.category === cat).length,
    }));
  };

  const value = {
    faqs,
    getAllFAQs,
    getByCategory,
    searchFAQs,
    getMostViewed,
    getMostHelpful,
    registerView,
    markAsHelpful,
    markAsNotHelpful,
    hasVoted,
    getUserVote,
    getCategories,
  };

  return <FAQContext.Provider value={value}>{children}</FAQContext.Provider>;
};
