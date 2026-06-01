// Feed misturado com vários tipos: post, vaga, servico, empresa
// A função shuffle embaralha para parecer um feed real e dinâmico

const rawFeed = [
  // ── POSTS NORMAIS ──────────────────────────────────────────────
  {
    id: "p1",
    type: "post",
    avatar: "https://i.pravatar.cc/150?img=32",
    author: "Joana Teixeira",
    role: "UX Designer • Luanda",
    content:
      "Acabei de lançar o meu portfólio atualizado! 🎨 Depois de 3 meses de trabalho intenso, estou muito orgulhosa do resultado. Disponível para novos projectos freelance a partir de Junho.",
    likes: 142,
    comments: 38,
    postedAt: "Há 15min",
    image: null,
  },
  {
    id: "p2",
    type: "post",
    avatar: "https://i.pravatar.cc/150?img=47",
    author: "Miguel Ferreira",
    role: "Engenheiro Civil • Huambo",
    content:
      "5 anos de carreira e cada obra conta uma história diferente 🏗️ Obrigado a todos os clientes que confiaram no meu trabalho. Sempre a crescer!",
    likes: 89,
    comments: 21,
    postedAt: "Há 1h",
    image: null,
  },
  {
    id: "p3",
    type: "post",
    avatar: "https://i.pravatar.cc/150?img=58",
    author: "Beatriz Neto",
    role: "Contabilista • Benguela",
    content:
      "Dica do dia 💡: Pequenas empresas em Angola podem reduzir até 30% nos impostos com uma gestão fiscal correcta. Precisas de ajuda? Entra em contacto!",
    likes: 203,
    comments: 67,
    postedAt: "Há 2h",
    image: null,
  },
  {
    id: "p4",
    type: "post",
    avatar: "https://i.pravatar.cc/150?img=12",
    author: "Rui Baptista",
    role: "Fotógrafo Profissional • Luanda",
    content:
      "Sessão de fotos corporativas concluída com sucesso! 📸 A equipa da TechAngola ficou absolutamente satisfeita. Booking aberto para Julho.",
    likes: 176,
    comments: 44,
    postedAt: "Há 3h",
    image:
      "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=500&q=80",
  },
  {
    id: "p5",
    type: "post",
    avatar: "https://i.pravatar.cc/150?img=22",
    author: "Sofia Lopes",
    role: "Marketing Digital • Cabinda",
    content:
      "O segredo para crescer no Instagram em 2025? Consistência + autenticidade + bom conteúdo. Simples assim! 🚀 Precisa de estratégia de social media para o teu negócio?",
    likes: 312,
    comments: 91,
    postedAt: "Há 5h",
    image: null,
  },

  // ── VAGAS ────────────────────────────────────────────────────────
  {
    id: "v1",
    type: "vaga",
    avatar: "https://i.pravatar.cc/150?img=1",
    company: "TechAngola",
    title: "Desenvolvedor React Native",
    description:
      "Buscamos um profissional para integrar a nossa equipa de tecnologia em Luanda. Experiência mínima de 2 anos com React Native.",
    location: "Luanda",
    jobType: "Full-time",
    salary: "250.000 – 400.000 MZN",
    isNew: true,
    postedAt: "Há 2h",
  },
  {
    id: "v2",
    type: "vaga",
    avatar: "https://i.pravatar.cc/150?img=15",
    company: "Constromax",
    title: "Engenheiro Civil Sênior",
    description:
      "Projeto de construção de grande porte requer engenheiro com experiência em gestão de obras e equipes. Possibilidade de progressão na carreira.",
    location: "Huambo",
    jobType: "Freelancer",
    salary: "A negociar",
    isNew: true,
    postedAt: "Há 4h",
  },
  {
    id: "v3",
    type: "vaga",
    avatar: "https://i.pravatar.cc/150?img=33",
    company: "Clínica Saúde Viva",
    title: "Médico Pediatra",
    description:
      "Clínica em expansão contrata pediatra para regime de tempo completo. Excelente ambiente de trabalho e benefícios competitivos.",
    location: "Benguela",
    jobType: "Full-time",
    salary: "600.000 MZN",
    isNew: false,
    postedAt: "Há 1d",
  },
  {
    id: "v4",
    type: "vaga",
    avatar: "https://i.pravatar.cc/150?img=44",
    company: "EduFuturo",
    title: "Professor de Matemática",
    description:
      "Escola particular em Luanda precisa de professor de matemática para turmas do ensino médio. Horário flexível e boa remuneração.",
    location: "Luanda",
    jobType: "Part-time",
    salary: "80.000 – 120.000 MZN",
    isNew: false,
    postedAt: "Há 2d",
  },
  {
    id: "v5",
    type: "vaga",
    avatar: "https://i.pravatar.cc/150?img=55",
    company: "LogiExpress",
    title: "Motorista com Carta D",
    description:
      "Empresa de logística contrata motoristas com carta D para rotas Luanda–Benguela. Alimentação e alojamento incluídos.",
    location: "Luanda / Benguela",
    jobType: "Full-time",
    salary: "150.000 MZN",
    isNew: true,
    postedAt: "Há 6h",
  },

  // ── SERVIÇOS ─────────────────────────────────────────────────────
  {
    id: "s1",
    type: "servico",
    avatar: "https://i.pravatar.cc/150?img=5",
    company: "Carlos Mendes",
    title: "Design de Logótipo Profissional",
    description:
      "Criação de identidade visual completa para a sua empresa. Entrega em 3 dias com revisões ilimitadas até à aprovação.",
    rating: 4.9,
    reviews: 128,
    price: "Desde 15.000 MZN",
    postedAt: "Há 3h",
  },
  {
    id: "s2",
    type: "servico",
    avatar: "https://i.pravatar.cc/150?img=20",
    company: "Ana Rodrigues",
    title: "Aulas de Inglês Online",
    description:
      "Professora certificada com 8 anos de experiência. Aulas para todos os níveis com horário totalmente flexível.",
    rating: 5.0,
    reviews: 87,
    price: "Desde 5.000 MZN/h",
    postedAt: "Há 5h",
  },
  {
    id: "s3",
    type: "servico",
    avatar: "https://i.pravatar.cc/150?img=36",
    company: "Pedro Alves",
    title: "Reparação de Electrodomésticos",
    description:
      "Técnico especializado em electrodomésticos de todas as marcas. Atendimento ao domicílio em Luanda. Orçamento grátis.",
    rating: 4.7,
    reviews: 203,
    price: "Desde 3.000 MZN",
    postedAt: "Há 7h",
  },
  {
    id: "s4",
    type: "servico",
    avatar: "https://i.pravatar.cc/150?img=48",
    company: "Luísa Cunha",
    title: "Consultoria Fiscal e Contabilidade",
    description:
      "Serviços de contabilidade para PMEs. Declarações fiscais, folhas de salário e relatórios financeiros mensais.",
    rating: 4.8,
    reviews: 56,
    price: "Desde 30.000 MZN/mês",
    postedAt: "Há 1d",
  },
  {
    id: "s5",
    type: "servico",
    avatar: "https://i.pravatar.cc/150?img=61",
    company: "Bruno Silva",
    title: "Desenvolvimento Web e Apps",
    description:
      "Criação de sites, lojas online e aplicações móveis. Tecnologias modernas, entrega rápida e suporte pós-lançamento.",
    rating: 4.9,
    reviews: 94,
    price: "Desde 50.000 MZN",
    postedAt: "Há 2d",
  },

  // ── EMPRESAS ─────────────────────────────────────────────────────
  {
    id: "e1",
    type: "empresa",
    avatar: "https://i.pravatar.cc/150?img=10",
    company: "Clínica Saúde Viva",
    title: "Estamos em expansão! 🏥",
    description:
      "A Clínica Saúde Viva abre as portas de uma nova unidade em Benguela. Trazemos saúde de qualidade mais perto de si.",
    location: "Benguela",
    postedAt: "Há 6h",
    isNew: false,
    employees: "120+",
  },
  {
    id: "e2",
    type: "empresa",
    avatar: "https://i.pravatar.cc/150?img=25",
    company: "LogiExpress Angola",
    title: "Nova rota Luanda–Cabinda 🚚",
    description:
      "Expandimos a nossa rede logística! Agora fazemos entregas em Cabinda em apenas 48h. Parceiros e clientes sejam bem-vindos.",
    location: "Cabinda",
    postedAt: "Há 1d",
    isNew: false,
    employees: "85",
  },
  {
    id: "e3",
    type: "empresa",
    avatar: "https://i.pravatar.cc/150?img=40",
    company: "TechAngola",
    title: "Somos finalistas do Angola Tech Awards 🏆",
    description:
      "Orgulhosos de anunciar que fomos nomeados para o prémio de Melhor Startup de Tecnologia de Angola 2025. Votação aberta!",
    location: "Luanda",
    postedAt: "Há 3h",
    isNew: true,
    employees: "45",
  },
  {
    id: "e4",
    type: "empresa",
    avatar: "https://i.pravatar.cc/150?img=52",
    company: "AgroAngola",
    title: "Colheita recorde este ano 🌱",
    description:
      "Graças à dedicação da nossa equipa e à parceria com produtores locais, registamos a maior colheita da nossa história. Angola alimenta Angola!",
    location: "Malanje",
    postedAt: "Há 8h",
    isNew: false,
    employees: "200+",
  },
];

// Embaralha o array de forma determinística usando seed baseado na data
function seededShuffle(arr) {
  const copy = [...arr];
  const seed = Math.floor(Date.now() / (1000 * 60 * 60)); // muda a cada hora
  let s = seed;
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const feedItems = seededShuffle(rawFeed);
export const feedTypes = ["Todos", "Posts", "Vagas", "Serviços", "Empresas"];
