/**
 * Big JS object to contain all hostgator links per market
 * 
 * Each value should be an object with a default value
 * as well as a value for each region with a key that matches 
 * the locale for that country (not language)
 * 
 * default - US (.com market)
 * BR - Brazil
 * MX - Mexico
 * CL - Chile
 * CO - Colombia
 * 
 * the value can be omitted and the default will be used
 * the value can also be set to false 
 *  - to check if the market should omit the block containing the link altogether
 * 
 */

const region = {
    main: {
        default: 'https://www.hostgator.com',
        BR: 'https://www.hostgator.com.br',
        MX: 'https://www.hostgator.mx',
        CL: 'https://www.hostgator.cl',
        CO: 'https://www.hostgator.co'
    },
    home_manage_sites: {
        default: 'https://portal.hostgator.com/packages',
        BR: 'https://cliente.hostgator.com.br/',
    },
    home_manage_email: {
        default: 'https://portal.hostgator.com/email',
        BR: 'https://cliente.hostgator.com.br/emails-list',
    },
    home_find_domain: {
        default: 'https://portal.hostgator.com/email',
        BR: 'https://www.hostgator.com.br/registro-de-dominio/',
    },
    help_phone_number: {
        default: 'tel:8669642867',
        BR: 'false', // a string false value will remove this section
    },
    help_chat: {
        default: 'https://helpchat.hostgator.com/',
        BR: 'https://financeiro.hostgator.com.br/chat/?country=br&department=technical', // ideally to be open in a popup, not new tab
    },
    help_twitter: {
        default: 'https://twitter.com/hgsupport',
        BR: 'https://twitter.com/hostgatorbrasil',
    },
    help_kb: {
        default: 'https://www.hostgator.com/help',
        BR: 'https://suporte.hostgator.com.br/hc/pt-br',
    },
    help_blog: {
        default: 'https://www.hostgator.com/blog/',
        BR: 'https://www.hostgator.com.br/blog/',
    },
    help_youtube: {
        default: 'https://www.youtube.com/c/hostgatorUS',
        BR: 'https://www.youtube.com/c/HostGatorBrasil',
    },

};

export default region;