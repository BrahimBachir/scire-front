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
      },
      tasks: 'learning/topics/tasks',
      questions: {
        questions: 'learning/questions',
        byRule: 'learning/questions/rule/:ruleCode/article/:artiCode',
        navigate: 'learning/questions/rule/:ruleCode/article/:artiCode/navigate'
      },
      tests: {
        tests: 'learning/tests',
        lastTest: 'learning/tests/last',
        testQuestion: 'learning/tests/questions',
        difficulties: 'learning/tests/difficulties',
        types: 'learning/tests/types'
      },
      flashcards: {
        flashcards: 'learning/flashcards',
        byRule: 'learning/flashcards/rule/:ruleCode/article/:artiCode',
        navigate: 'learning/flashcards/rule/:ruleCode/article/:artiCode/navigate',
      },
      notes: {
        notes: 'learning/notes',
        byRule: 'learning/notes/rule/:ruleCode/article/:artiCode',
        navigate: 'learning/notes/rule/:ruleCode/article/:artiCode/navigate',
      },
      tracker: 'learning/tracker',
      stats: {
        dashboard: 'learning/stats/dashboard',
      },
      courses: {
        courses: 'learning/courses',
        my_courses: 'learning/courses/my-courses',
        types: 'learning/courses/types',
        callingOrgs: 'learning/courses/calling-orgs',
        topics: 'learning/courses/:id/topics',
        join: 'learning/courses/:id/join',
        is_join: 'learning/courses/:id/is-joined',
        un_join: 'learning/courses/:id/un-join',
        favourite: 'learning/courses/:id/favourite',
        is_favourite: 'learning/courses/:id/is-favourite',
      },
      videos: {
        videos: "learning/videos",
        byRule: 'learning/videos/rule/:ruleCode/article/:artiCode',
        navigate: 'learning/videos/rule/:ruleCode/article/:artiCode/navigate'
      },
      schemes: {
        schemes: 'learning/schemes',
        byRule: 'learning/schemes/rule/:ruleCode/article/:artiCode',
        navigate: 'learning/schemes/rule/:ruleCode/article/:artiCode/navigate'
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
      articles: 'rules/:ruleCode/article/:artiCode',
      index: 'rules/index/:ruleCode',
      types: 'rules/types',
      ambits: 'rules/ambits',
      gazettes: 'rules/gazettes',
      metadata: 'rules/:ruleCode/metadata',
      one_by_id: 'rules/by-id/:id/',
      one_by_code: 'rules/by-code/:ruleCode',
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
    }
  }
};
