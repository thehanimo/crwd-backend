const getBookReviews = () => {
  let reviews = [];
  let rating = 0,
    rating_count = 3;
  for (let i = 0; i < rating_count; i++) {
    let rand = Math.round(Math.random() * 4);
    reviews.push({
      username: names[Math.round(Math.random() * 99)].username,
      rating: bookReviews[rand].rating,
      review: bookReviews[rand].review,
      date_written: new Date(Date.now()),
    });
    rating += bookReviews[rand].rating;
  }
  rating /= rating_count;

  return { reviews, rating, rating_count };
};

const getCourseReviews = () => {
  let reviews = [];
  let rating = 0,
    rating_count = 3;
  for (let i = 0; i < rating_count; i++) {
    let rand = Math.round(Math.random() * 4);
    reviews.push({
      username: names[Math.round(Math.random() * 99)].username,
      rating: courseReviews[rand].rating,
      review: courseReviews[rand].review,
      date_written: new Date(
        Date.now() - 1000 * 60 * 60 * Math.round(Math.random() * 24 * 7)
      ),
    });
    rating += courseReviews[rand].rating;
  }
  rating /= rating_count;
  reviews.sort((a, b) => (a.date_written < b.date_written ? -1 : 1));

  return { reviews, rating, rating_count };
};

const getRandomDiscussions = () => {
  let comments = [];
  let rand = Math.round(Math.random() * 3);
  for (let i = 0; i < 2; i++) {
    let discList = randomDiscussions[(rand + i) % 4];
    for (let j = 0; j < discList.length; j++) {
      comments.push({
        username: names[Math.round(Math.random() * 99)].username,
        user_picture: `https://randomuser.me/api/portraits/${
          Math.random() >= 0.5 ? "" : "wo"
        }men/${Math.round(Math.random() * 99)}.jpg`,
        comment: discList[j],
        date_written: new Date(Date.now() - 1000 * 60 * 60 * (i * 10 + j)),
      });
    }
  }
  return comments.sort((a, b) => (a.date_written < b.date_written ? -1 : 1));
};

const getPlaylists = () => {
  let data = [];
  for (let i = 0; i < playlists.length; i++) {
    let { reviews, rating, rating_count } = getCourseReviews();
    let comments = getRandomDiscussions();
    data.push({
      ...playlists[i],
      rating,
      rating_count,
      playlistinfo: {
        ...playlists[i].playlistinfo,
        comments,
        reviews,
      },
    });
  }
  return data;
};

module.exports = {
  getBookReviews,
  getCourseReviews,
  getRandomDiscussions,
  getPlaylists,
};

const randomDiscussions = [
  [
    "Is this worth it? I am a bit skeptical about it. Does anyone know where I can get a preview?",
    "Totally! This has been one of my best investments. I haven't come across a preview tho. You could try YouTube..",
    "I concur. It is worth every penny! 💰",
    "Don't hesitate!!!!!",
  ],
  [
    "Did anyone find this needlessly dragged along? I feel like it could've been much crisper and shorter.",
    "You're not alone... agree 100%",
    "Me too!",
    "Umm.. not exactly. I think those long explanations are necessary.",
  ],
  [
    "Would love to know if the reviews for this one are actually true.. I feel like it's rigged given that Amazon says quite the opposite haha 😂",
    "😆. Maybe.. you never know.... Jokes aside, No. The reviews are original.",
    "Yea.. the reviews aren't fake.",
    "I felt the same way too haha 😆",
  ],
  [
    "Is there a free version available?",
    "Nope..",
    "No, there is a preview availble tho on their official website.",
    "The preview is quite good actuallly..",
  ],
];
const bookReviews = [
  {
    review: "Wow! An amazing read. Would recommend this to anyone, any day! 💯",
    rating: 4.5,
  },
  {
    review:
      "This book is amazing. Although unappealing to beginners, it is quite impressive! 👍",
    rating: 3.5,
  },
  {
    review: "A good read. Didn't find anything quite new in it though.",
    rating: 3,
  },
  {
    review: "A mediocre read. There are better books out there.",
    rating: 1.5,
  },
  {
    review:
      "Poor. Full of typos and errors. Didn't expect this from such reputed publishers. 👎",
    rating: 0.5,
  },
];

const courseReviews = [
  {
    review:
      "Wow! An amazing course. Would recommend this to anyone, any day! 💯",
    rating: 5,
  },
  {
    review:
      "This course is amazing. Although unappealing to beginners, it is quite impressive! 👍",
    rating: 4.5,
  },
  {
    review: "A good course. Didn't find anything quite new in it though.",
    rating: 4,
  },
  {
    review: "A mediocre course. There are better courses out there.",
    rating: 3.5,
  },
  {
    review: "Poor. Full of typos and errors. Didn't expect this at all. 👎",
    rating: 0.5,
  },
];
const names = [
  {
    username: "Jody Whimp".toLowerCase().split(" ")[0],
  },
  {
    username: "Deane Vaulkhard".toLowerCase().split(" ")[0],
  },
  {
    username: "Allegra Silly".toLowerCase().split(" ")[0],
  },
  {
    username: "Edi Taaffe".toLowerCase().split(" ")[0],
  },
  {
    username: "Hilda Rollo".toLowerCase().split(" ")[0],
  },
  {
    username: "Hesther Farrin".toLowerCase().split(" ")[0],
  },
  {
    username: "Nial Maudsley".toLowerCase().split(" ")[0],
  },
  {
    username: "Faydra Radeliffe".toLowerCase().split(" ")[0],
  },
  {
    username: "Alyosha Keeney".toLowerCase().split(" ")[0],
  },
  {
    username: "Ekaterina Ricks".toLowerCase().split(" ")[0],
  },
  {
    username: "Garvin Umney".toLowerCase().split(" ")[0],
  },
  {
    username: "Othilia Di Gregorio".toLowerCase().split(" ")[0],
  },
  {
    username: "Urbanus Andreaccio".toLowerCase().split(" ")[0],
  },
  {
    username: "Gavin Worpole".toLowerCase().split(" ")[0],
  },
  {
    username: "Tiffi Brimacombe".toLowerCase().split(" ")[0],
  },
  {
    username: "Marti Chamberlaine".toLowerCase().split(" ")[0],
  },
  {
    username: "Averyl Birdis".toLowerCase().split(" ")[0],
  },
  {
    username: "Gerardo Bleyman".toLowerCase().split(" ")[0],
  },
  {
    username: "Tobe Power".toLowerCase().split(" ")[0],
  },
  {
    username: "Camellia Dashkov".toLowerCase().split(" ")[0],
  },
  {
    username: "Ryan Skarr".toLowerCase().split(" ")[0],
  },
  {
    username: "Jason Gemmell".toLowerCase().split(" ")[0],
  },
  {
    username: "Alard Ciccottini".toLowerCase().split(" ")[0],
  },
  {
    username: "Marion Klosterman".toLowerCase().split(" ")[0],
  },
  {
    username: "Obidiah Balducci".toLowerCase().split(" ")[0],
  },
  {
    username: "Chrystal Pitrelli".toLowerCase().split(" ")[0],
  },
  {
    username: "Geoffry Spracklin".toLowerCase().split(" ")[0],
  },
  {
    username: "Mechelle Martini".toLowerCase().split(" ")[0],
  },
  {
    username: "Daffy Lewsy".toLowerCase().split(" ")[0],
  },
  {
    username: "Sonni Swadling".toLowerCase().split(" ")[0],
  },
  {
    username: "Inga Gravy".toLowerCase().split(" ")[0],
  },
  {
    username: "Lanie Tradewell".toLowerCase().split(" ")[0],
  },
  {
    username: "Otto Bagott".toLowerCase().split(" ")[0],
  },
  {
    username: "Cirillo Brimilcombe".toLowerCase().split(" ")[0],
  },
  {
    username: "Odele Hysom".toLowerCase().split(" ")[0],
  },
  {
    username: "Bonnibelle Burkinshaw".toLowerCase().split(" ")[0],
  },
  {
    username: "Lanny Chadderton".toLowerCase().split(" ")[0],
  },
  {
    username: "Hermy Batey".toLowerCase().split(" ")[0],
  },
  {
    username: "Hilton Skittrell".toLowerCase().split(" ")[0],
  },
  {
    username: "Dionne Tidbald".toLowerCase().split(" ")[0],
  },
  {
    username: "Gustav McCallam".toLowerCase().split(" ")[0],
  },
  {
    username: "Clementia McElroy".toLowerCase().split(" ")[0],
  },
  {
    username: "Zora Ivanin".toLowerCase().split(" ")[0],
  },
  {
    username: "Ginger Tildesley".toLowerCase().split(" ")[0],
  },
  {
    username: "Konstantine Baggally".toLowerCase().split(" ")[0],
  },
  {
    username: "Maddi Lewnden".toLowerCase().split(" ")[0],
  },
  {
    username: "Enrika McKeveney".toLowerCase().split(" ")[0],
  },
  {
    username: "Rosalia Fowkes".toLowerCase().split(" ")[0],
  },
  {
    username: "Glenden Jordeson".toLowerCase().split(" ")[0],
  },
  {
    username: "Oralie Springell".toLowerCase().split(" ")[0],
  },
  {
    username: "Iggie Corless".toLowerCase().split(" ")[0],
  },
  {
    username: "Teddi Pescud".toLowerCase().split(" ")[0],
  },
  {
    username: "Orv Speight".toLowerCase().split(" ")[0],
  },
  {
    username: "Miran Mailes".toLowerCase().split(" ")[0],
  },
  {
    username: "Gustave Brideoke".toLowerCase().split(" ")[0],
  },
  {
    username: "Renelle Baynard".toLowerCase().split(" ")[0],
  },
  {
    username: "Ludvig Phillins".toLowerCase().split(" ")[0],
  },
  {
    username: "Aaron Pfeffle".toLowerCase().split(" ")[0],
  },
  {
    username: "Gipsy Portail".toLowerCase().split(" ")[0],
  },
  {
    username: "Bridgette Lie".toLowerCase().split(" ")[0],
  },
  {
    username: "Jaime Pinkstone".toLowerCase().split(" ")[0],
  },
  {
    username: "Skipper Harbar".toLowerCase().split(" ")[0],
  },
  {
    username: "Michele Hunnable".toLowerCase().split(" ")[0],
  },
  {
    username: "Hamlin Ruggs".toLowerCase().split(" ")[0],
  },
  {
    username: "Eunice Bassick".toLowerCase().split(" ")[0],
  },
  {
    username: "Hilarius Grigson".toLowerCase().split(" ")[0],
  },
  {
    username: "Lenci Landrean".toLowerCase().split(" ")[0],
  },
  {
    username: "Ivor Assiratti".toLowerCase().split(" ")[0],
  },
  {
    username: "Gladi Yanshin".toLowerCase().split(" ")[0],
  },
  {
    username: "Jacquelin Arrington".toLowerCase().split(" ")[0],
  },
  {
    username: "Datha Langlands".toLowerCase().split(" ")[0],
  },
  {
    username: "Peder Wyatt".toLowerCase().split(" ")[0],
  },
  {
    username: "Shayne Raddenbury".toLowerCase().split(" ")[0],
  },
  {
    username: "Trever Stainfield".toLowerCase().split(" ")[0],
  },
  {
    username: "Elwin Buscher".toLowerCase().split(" ")[0],
  },
  {
    username: "Devi Duckering".toLowerCase().split(" ")[0],
  },
  {
    username: "Katherina Folland".toLowerCase().split(" ")[0],
  },
  {
    username: "Nelie Morphet".toLowerCase().split(" ")[0],
  },
  {
    username: "Eva Rubinek".toLowerCase().split(" ")[0],
  },
  {
    username: "Heda Tuffield".toLowerCase().split(" ")[0],
  },
  {
    username: "Sly Wise".toLowerCase().split(" ")[0],
  },
  {
    username: "Salvador Cleobury".toLowerCase().split(" ")[0],
  },
  {
    username: "Karleen Nystrom".toLowerCase().split(" ")[0],
  },
  {
    username: "Doug Durtnel".toLowerCase().split(" ")[0],
  },
  {
    username: "Alexei Seabridge".toLowerCase().split(" ")[0],
  },
  {
    username: "Rollo Fominov".toLowerCase().split(" ")[0],
  },
  {
    username: "Reyna Greenhall".toLowerCase().split(" ")[0],
  },
  {
    username: "Tomkin MacKintosh".toLowerCase().split(" ")[0],
  },
  {
    username: "Colin Kreuzer".toLowerCase().split(" ")[0],
  },
  {
    username: "Dermot Cheal".toLowerCase().split(" ")[0],
  },
  {
    username: "Walsh Camis".toLowerCase().split(" ")[0],
  },
  {
    username: "Melinde Harriott".toLowerCase().split(" ")[0],
  },
  {
    username: "Bentlee D'Alesio".toLowerCase().split(" ")[0],
  },
  {
    username: "Jeth Sheward".toLowerCase().split(" ")[0],
  },
  {
    username: "Miof mela Hinken".toLowerCase().split(" ")[0],
  },
  {
    username: "Ford Llorens".toLowerCase().split(" ")[0],
  },
  {
    username: "Carissa Breddy".toLowerCase().split(" ")[0],
  },
  {
    username: "Lorrie Hardstaff".toLowerCase().split(" ")[0],
  },
  {
    username: "Arnaldo Bratley".toLowerCase().split(" ")[0],
  },
  {
    username: "Fanechka Linkin".toLowerCase().split(" ")[0],
  },
];

const playlists = [
  {
    title: "Node.js made Easy",
    description: "Follow these steps to master Node.js",
    username: names[Math.round(Math.random() * 99)].username,
    user_picture: `https://randomuser.me/api/portraits/${
      Math.random() >= 0.5 ? "" : "wo"
    }men/${Math.round(Math.random() * 99)}.jpg`,
    playlistinfo: {
      tags: [],
      reviews: [],
      comments: [],
      content: [
        {
          id: "1",
          title: "Step 1: Know what Node.js is exactly",
          description: "",
          link:
            "https://medium.com/free-code-camp/what-exactly-is-node-js-ae36e97449f5",
        },
        {
          id: "2",
          title: "Step 2: Follow this amazing YouTube video",
          description: "",
          link: "https://www.youtube.com/watch?v=fBNz5xF-Kx4",
        },
        {
          id: "3",
          title: "Step 3: Skim through the Node.js docs",
          description: "",
          link: "https://nodejs.org/en/docs/guides/",
        },
      ],
    },
  },
  {
    title: "Dive into Data Science",
    description:
      "With these resources, you should be able to become the data scientist everyone aspires to be..",
    username: names[Math.round(Math.random() * 99)].username,
    user_picture: `https://randomuser.me/api/portraits/${
      Math.random() >= 0.5 ? "" : "wo"
    }men/${Math.round(Math.random() * 99)}.jpg`,
    playlistinfo: {
      tags: [],
      reviews: [],
      comments: [],
      content: [
        {
          id: "1",
          title: "Step 1: What exactly is data science?",
          description: "",
          link:
            "https://medium.com/@onejohi/an-introduction-to-data-science-32403b22f5c1",
        },
        {
          id: "2",
          title: "Step 2: Here's what data scientists say",
          description: "",
          link: "https://www.youtube.com/watch?v=dYZJxhYjBE8",
        },
        {
          id: "3",
          title: "Step 3: Here's what you shouldn't be doing",
          description: "",
          link: "https://www.youtube.com/watch?v=4OZip0cgOho",
        },
        {
          id: "4",
          title: "Step 4: Finish it off with this amazing course.",
          description: "",
          link: "https://www.youtube.com/watch?v=ua-CiDNNj30",
        },
      ],
    },
  },
  {
    title: "The Best Way to Learn React.js",
    description:
      "With these resources, you should be able to master React.js in no time.",
    username: names[Math.round(Math.random() * 99)].username,
    user_picture: `https://randomuser.me/api/portraits/${
      Math.random() >= 0.5 ? "" : "wo"
    }men/${Math.round(Math.random() * 99)}.jpg`,
    playlistinfo: {
      tags: [],
      reviews: [],
      comments: [],
      content: [
        {
          id: "1",
          title: "Step 1: Follow the official Tutorial",
          description: "",
          link: "https://reactjs.org/tutorial/tutorial.html",
        },
        {
          id: "2",
          title: "Step 2: Follow NetNinja's YouTube video playlist",
          description: "",
          link: "https://www.youtube.com/watch?v=ur6I5m2nTvk",
        },
        {
          id: "3",
          title: "Step 3: Contribute to open source React projects",
          description: "",
          link:
            "https://github.com/facebook/react/network/dependents?package_id=UGFja2FnZS0xMzM2NDkxNg%3D%3D",
        },
      ],
    },
  },
  {
    title: "Mastering SwiftUI in 5 Steps",
    description: "Master the newly launched SwiftUI by Apple.",
    username: names[Math.round(Math.random() * 99)].username,
    user_picture: `https://randomuser.me/api/portraits/${
      Math.random() >= 0.5 ? "" : "wo"
    }men/${Math.round(Math.random() * 99)}.jpg`,
    playlistinfo: {
      tags: [],
      reviews: [],
      comments: [],
      content: [
        {
          id: "1",
          title: "Step 1: How is SwiftUI different from the rest?",
          description: "",
          link:
            "https://medium.com/@navdeepsingh_2336/swiftui-introduction-2204b2f541b7",
        },

        {
          id: "2",
          title:
            "Step 2: Stanford CS193P by Paul Hegarty is fully available on YouTube",
          description: "",
          link: "https://www.youtube.com/watch?v=jbtqIBpUG7g",
        },
        {
          id: "3",
          title: "Step 3: Follow this short, quick SwiftUI Tutorial by Apple",
          description: "",
          link:
            "https://developer.apple.com/tutorials/swiftui/creating-and-combining-views",
        },
        {
          id: "4",
          title:
            "Step 4: DesignCode has some really amazing desigin tutorials for SwiftUI",
          description: "",
          link: "https://www.youtube.com/watch?v=jbtqIBpUG7g",
        },
        {
          id: "5",
          title: "Step 5: Contribute to amazing open source SwiftUI projects",
          description: "",
          link:
            "https://medium.com/better-programming/7-awesome-open-source-swiftui-projects-to-inspire-you-aff778e5d413",
        },
      ],
    },
  },
];
