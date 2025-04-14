const { createApp } = Vue;

createApp({
  data() {
    return {
      testimonials: [
        {
          image: "https://randomuser.me/api/portraits/men/32.jpg",
          text: "Сервіс був відмінним! Все доставили швидко і без проблем.",
          name: "Іван Петренко",
          place: "Київ, Україна",
        },
        {
          image: "https://randomuser.me/api/portraits/women/45.jpg",
          text: "Дуже задоволена якістю обслуговування та підтримкою.",
          name: "Ольга Шевченко",
          place: "Львів, Україна",
        },
        {
          image: "https://randomuser.me/api/portraits/men/14.jpg",
          text: "Команда спрацювала професійно! Рекомендую!",
          name: "Андрій Коваль",
          place: "Дніпро, Україна",
        },
        {
          image: "https://randomuser.me/api/portraits/women/22.jpg",
          text: "Найкращий логістичний досвід за останній рік!",
          name: "Марія Іваненко",
          place: "Одеса, Україна",
        },
        {
          image: "https://randomuser.me/api/portraits/men/30.jpg",
          text: "Швидко, надійно, зручно — без зайвого клопоту!",
          name: "Олег Васильчук",
          place: "Харків, Україна",
        },
      ],
    };
  },
  methods: {
    scrollLeft() {
      this.$refs.carousel.scrollLeft -= 300;
    },
    scrollRight() {
      this.$refs.carousel.scrollLeft += 300;
    },
  },
}).mount("#testimonialApp");
