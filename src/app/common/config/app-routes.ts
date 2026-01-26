export const Routes = {
  auth: {
    base: 'http://localhost:3800/api/',
    logins: 'logins',
    new: 'logins/new',
    validate: 'logins/validate-email/:userCode',
    resend: 'logins/resend-code/:userCode',
  },
  api: {
    base: 'http://localhost:3300/api/',
    users: {
      new_login: 'users/new-login',
      logged: 'users/loged',
      all: 'users'
    },
    config: {
      pricing_planes: 'configs/pricing-planes',
      variables: 'variables',
    },
    genders: {
      all: 'genders',
    },
    roles: {
      all: 'roles',
    },
    learning: {
      categories: 'learning/categories',
      sections: 'learning/sections',
      topics: {
        topics: 'learning/topics',
        blocks: 'learning/topics/:id/blocks',
        articles: 'learning/topics/:topicId/articles',
      },
      tasks: 'learning/topics/tasks',
      questions: {
        questions: 'learning/questions',
        byRule: 'learning/questions/rule/:ruleCode/article/:articleId',
        byArticle: 'learning/questions/article/:articleId',
        navigate: 'learning/questions/article/:articleId/navigate'
      },
      tests: {
        tests: 'learning/tests',
        lastTest: 'learning/tests/last',
        testQuestion: 'learning/tests/questions',
        difficulties: 'learning/tests/difficulties',
        types: 'learning/tests/types'
      },
      difficulties: {
        base: 'learning/difficulties',
      },
      flashcards: {
        flashcards: 'learning/flashcards',
        byRule: 'learning/flashcards/rule/:ruleCode/article/:articleId',
        byArticle: 'learning/flashcards/article/:articleId',
        //navigate: 'learning/flashcards/rule/:ruleCode/article/:articleId/navigate',
        navigate: 'learning/flashcards/article/:articleId/navigate',
      },
      notes: {
        notes: 'learning/notes',
        byRule: 'learning/notes/rule/:ruleCode/article/:articleId',
        navigate: 'learning/notes/article/:articleId/navigate',
      },
      tracker: 'learning/tracker',
      stats: {
        dashboard: 'learning/stats/dashboard',
      },
      courses: {
        base: 'learning/courses',
        my_courses: 'learning/courses/my-courses',
        types: 'learning/courses/types',
        tags: 'learning/courses/tags',
        statuses: 'learning/courses/statuses',
        callingOrgs: 'learning/courses/calling-orgs',
        categories: 'learning/courses/categories',
        topics: 'learning/courses/:id/topics',
        join: 'learning/courses/:id/join',
        is_join: 'learning/courses/:id/is-joined',
        un_join: 'learning/courses/:id/un-join',
        favourite: 'learning/courses/:id/favourite',
        is_favourite: 'learning/courses/:id/is-favourite',
        progress: {
          base: 'learning/courses/progress',
          course: 'learning/courses/progress/:courseId',
          topic: 'learning/courses/progress/:courseId/topic/:topicId',
          course_articles: 'learning/courses/progress/:courseId/topic/:topicId/articles',
          rule_articles: 'learning/courses/progress/:ruleId/articles',
          article: 'learning/courses/progress/article/:articleId',
        }
      },
      videos: {
        videos: "learning/videos",
        byRule: 'learning/videos/rule/:ruleCode/article/:articleId',
        byArticle: 'learning/videos/article/:articleId',
        navigate: 'learning/videos/article/:articleId/navigate'
      },
      schemes: {
        schemes: 'learning/schemes',
        byRule: 'learning/schemes/rule/:ruleCode/article/:articleId',
        byArticle: 'learning/schemes/article/:articleId',
        navigate: 'learning/schemes/article/:articleId/navigate'
      },
    },
    seed: {
      categories: 'seed/categories',
      sections: 'seed/sections',
      topics: 'seed/topics',
      questions: 'seed/questions',
      flashcards: 'seed/flashcards',
      videos: 'seed/videos',
      schemes: 'seed/schemes',
    },
    rule: {
      base: 'rules',
      article: 'rules/articles/:articleId',
      articles: 'rules/:ruleId/articles',
      index: 'rules/index/:ruleCode',
      types: 'rules/types',
      ambits: 'rules/ambits',
      gazettes: 'rules/gazettes',
      metadata: 'rules/:ruleCode/metadata',
      one_by_id: 'rules/by-id/:id/',
      one_by_code: 'rules/by-code/:ruleCode',
    },
    articles: {
      base: 'articles',
      all_by_rule: 'articles/:ruleId'
    },
    reactions: {
      base: 'reactions',
      feature_vote: 'reactions/feature-vote/',
      vote_state: 'reactions/vote-state'
    },
    reviews: {
      base: 'reviews',
      summary: 'reviews/summary',
      latests: 'reviews/latests',
    },
    comments: {
      base: 'comments'
    }
  }
};
