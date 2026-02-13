export const MENUITEMS = [
  {
    menutitle: "General",
    menucontent: "Dashboards,Widgets",
    Items: [

         { path: '/dashboard', icon: "icofont-home", id:'dashboard',title: "Dashboard", type: "link" },
         { path: '/todays_pick', icon: "icofont-chart-histogram",id:'todays_pick', title: "Today's Pick", type: "link" },
         { path: '/how_to_trade', icon: "icofont-question-square",id:'how_to_trade', title: "How To Trade", type: "link" },
         { path: '/terms_of_use', icon: "icofont-ui-note",id:'terms_of_use', title: "Terms Of Use", type: "link" },
         { path: '/privacy_policy', icon: "icofont-shield-alt",id:'privacy_policy', title: "Privacy & Policy", type: "link" },
         { path: '/disclaimer', icon: "icofont-exclamation-square",id:'disclaimer', title: "Disclaimer", type: "link" },
    ],
  },
    {
    menutitle: "SETTINGS",
    menucontent: "Ready to use Apps",
    Items: [
      { path: '/profile', icon: "icofont-user-alt-3", id:'profile', title: "Profile", type: "link" },
      { path: '/change_password', icon: "icofont-ui-password",id:'change_password', title: "Change Password", type: "link" },
      { path: `${process.env.PUBLIC_URL}/`, icon: "icofont-logout",id:'logout', title: "Logout", type: "link" },
    
    ],
  },


];
