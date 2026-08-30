import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/core-pages/home/home').then((m) => m.Home),
  },
  { path: 'default', redirectTo: '' }, // real site's /default is byte-identical to /home
  {
    path: 'about',
    loadComponent: () => import('./features/core-pages/about/about').then((m) => m.About),
  },
  {
    path: 'askusanything',
    loadComponent: () =>
      import('./features/core-pages/ask-us-anything/ask-us-anything').then((m) => m.AskUsAnything),
  },
  {
    path: 'faq',
    loadComponent: () => import('./features/core-pages/faq/faq').then((m) => m.Faq),
  },
  {
    path: 'medical',
    loadComponent: () => import('./features/core-pages/medical/medical').then((m) => m.Medical),
  },
  {
    path: 'terms',
    loadComponent: () => import('./features/core-pages/terms/terms').then((m) => m.Terms),
  },

  {
    path: 'shop',
    loadComponent: () => import('./features/shop/shop-home/shop-home').then((m) => m.ShopHome),
  },
  {
    path: 'shop/:category',
    loadComponent: () =>
      import('./features/shop/category-list/category-list').then((m) => m.CategoryList),
  },
  {
    path: 'shop/:category/:productSlug',
    loadComponent: () =>
      import('./features/shop/product-detail/product-detail').then((m) => m.ProductDetail),
  },

  {
    path: 'stores',
    loadComponent: () =>
      import('./features/store-locator/store-list/store-list').then((m) => m.StoreList),
  },
  {
    path: 'stores/:slug',
    loadComponent: () =>
      import('./features/store-locator/store-detail/store-detail').then((m) => m.StoreDetail),
  },

  {
    path: 'learn',
    loadComponent: () => import('./features/learn/learn-list/learn-list').then((m) => m.LearnList),
  },
  {
    path: 'learn/:slug',
    loadComponent: () =>
      import('./features/learn/article-detail/article-detail').then((m) => m.ArticleDetail),
  },
  {
    path: 'page/:slug',
    loadComponent: () => import('./features/cms-pages/cms-page/cms-page').then((m) => m.CmsPage),
  },

  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart').then((m) => m.Cart),
  },
  {
    path: 'checkout',
    loadComponent: () => import('./features/checkout/checkout/checkout').then((m) => m.Checkout),
  },
  {
    path: 'confirmation',
    loadComponent: () =>
      import('./features/checkout/confirmation/confirmation').then((m) => m.Confirmation),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
  },
  {
    path: 'account',
    canActivate: [authGuard],
    loadComponent: () => import('./features/account/account').then((m) => m.Account),
  },
  {
    path: 'rewards',
    loadComponent: () => import('./features/rewards/rewards').then((m) => m.Rewards),
  },

  {
    path: '**',
    loadComponent: () => import('./shared/not-found/not-found').then((m) => m.NotFound),
  },
];
