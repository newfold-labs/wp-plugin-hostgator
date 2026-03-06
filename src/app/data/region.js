/**
 * Big JS object to contain all hostgator links per market
 *
 * Each value should be an object with a default value
 * as well as a value for each region with a key that matches
 * the locale for that country (not language)
 *
 * default - US (.com market)
 * AR - Argentina
 * BO - Bolivia
 * BR - Brazil
 * CL - Chile
 * CO - Colombia
 * DO - Dominican Republic
 * EC - Ecuador
 * MX - Mexico
 * PR - Peru
 * UY - Uruguay
 *
 * the value can be omitted and the default will be used
 * the value can also be set to false
 *  - to check if the market should omit the block containing the link altogether
 *
 */

const region = {
	main: {
		// the main link the regional hostgator site. Used as a fallback or default link per region.
		default: 'https://www.hostgator.com',
		AR: 'https://www.hostgator.ar',
		BO: 'https://www.hostgator.bo',
		BR: 'https://www.hostgator.com.br',
		CL: 'https://www.hostgator.cl',
		CO: 'https://www.hostgator.co',
		DO: 'https://www.hostgator.do',
		EC: 'https://www.hostgator.net.ec',
		MX: 'https://www.hostgator.mx',
		PE: 'https://www.hostgator.pe',
		UY: 'https://www.hostgator.uy',
	},
	site_info_portal: {
		// site info portal link in plugin info section - big button with snappy icon.
		default: 'https://www.hostgator.com/my-account/login',
		AR: 'https://cliente.hostgator.ar',
		BO: 'https://cliente.hostgator.bo',
		BR: 'https://financeiro.hostgator.com.br',
		CL: 'https://cliente.hostgator.cl',
		CO: 'https://cliente.hostgator.co',
		DO: 'https://cliente.hostgator.do',
		EC: 'https://cliente.hostgator.net.ec',
		MX: 'https://cliente.hostgator.mx',
		PE: 'https://cliente.hostgator.pe',
		UY: 'https://cliente.hostgator.uy',
	},
	home_manage_sites: {
		// Manage Sites button to manage sites within control panel.
		default: 'https://www.hostgator.com/my-account/hosting/details/sites',
		AR: 'https://cliente.hostgator.ar/sitios-web',
		BO: 'https://cliente.hostgator.bo/sitios-web',
		BR: 'https://cliente.hostgator.com.br',
		CL: 'https://cliente.hostgator.cl/sitios-web',
		CO: 'https://cliente.hostgator.co/sitios-web',
		DO: 'https://cliente.hostgator.do/sitios-web',
		EC: 'https://cliente.hostgator.net.ec/sitios-web',
		MX: 'https://cliente.hostgator.mx/sitios-web',
		PE: 'https://cliente.hostgator.pe/sitios-web',
		UY: 'https://cliente.hostgator.uy/sitios-web',
	},
	home_manage_email: {
		// Manage email button to manage email in control panel.
		default:
			'https://www.hostgator.com/my-account/google-workspace/google-workspace-list',
		AR: 'https://cliente.hostgator.ar/e-mails',
		BO: 'https://cliente.hostgator.bo/e-mails',
		BR: 'https://cliente.hostgator.com.br/emails-list',
		CL: 'https://cliente.hostgator.cl/emails-list',
		CO: 'https://cliente.hostgator.co/emails-list',
		DO: 'https://cliente.hostgator.do/e-mails',
		EC: 'https://cliente.hostgator.net.ec/e-mails',
		MX: 'https://cliente.hostgator.mx/e-mails',
		PE: 'https://cliente.hostgator.pe/e-mails',
		UY: 'https://cliente.hostgator.uy/e-mails',
	},
	home_find_domain: {
		// Manage Domain button to manage domains in control panel.
		default:
			'https://www.hostgator.com/my-account/domain-center/domain-list',
		AR: 'https://www.hostgator.ar/dominios',
		BO: 'https://www.hostgator.bo/dominios',
		BR: 'https://www.hostgator.com.br/registro-de-dominio/',
		CL: 'https://www.hostgator.cl/dominios',
		CO: 'https://www.hostgator.co/dominios',
		DO: 'https://www.hostgator.do/dominios',
		EC: 'https://www.hostgator.net.ec/dominios',
		MX: 'https://www.hostgator.mx/dominios',
		PE: 'https://www.hostgator.pe/dominios',
		UY: 'https://www.hostgator.uy/dominios',
	},
	help_phone_number: {
		// Support phone number. A string 'false' value will remove this section if there is no phone support in the region.
		default: 'tel:8669642867',
		AR: 'false',
		BO: 'false',
		BR: 'false',
		CL: 'false',
		CO: 'false',
		DO: 'false',
		EC: 'false',
		MX: 'false',
		PE: 'false',
		UY: 'false',
	},
	help_chat: {
		// Support live chat link.
		default: 'https://helpchat.hostgator.com',
		AR: 'https://soporte.hostgator.mx/hc/es-419/articles/28439167280915-C%C3%B3mo-entrar-en-contacto-con-Soporte',
		BO: 'https://soporte.hostgator.mx/hc/es-419/articles/28439167280915-C%C3%B3mo-entrar-en-contacto-con-Soporte',
		BR: 'https://soporte.hostgator.mx/hc/es-419/articles/28439167280915-C%C3%B3mo-entrar-en-contacto-con-Soporte',
		CL: 'https://soporte.hostgator.mx/hc/es-419/articles/28439167280915-C%C3%B3mo-entrar-en-contacto-con-Soporte',
		CO: 'https://soporte.hostgator.mx/hc/es-419/articles/28439167280915-C%C3%B3mo-entrar-en-contacto-con-Soporte',
		DO: 'https://soporte.hostgator.mx/hc/es-419/articles/28439167280915-C%C3%B3mo-entrar-en-contacto-con-Soporte',
		EC: 'https://soporte.hostgator.mx/hc/es-419/articles/28439167280915-C%C3%B3mo-entrar-en-contacto-con-Soporte',
		MX: 'https://soporte.hostgator.mx/hc/es-419/articles/28439167280915-C%C3%B3mo-entrar-en-contacto-con-Soporte',
		PE: 'https://soporte.hostgator.mx/hc/es-419/articles/28439167280915-C%C3%B3mo-entrar-en-contacto-con-Soporte',
		UY: 'https://soporte.hostgator.mx/hc/es-419/articles/28439167280915-C%C3%B3mo-entrar-en-contacto-con-Soporte',
	},
	help_twitter: {
		// Region-specific Twitter/X url for support. A string 'false' value will remove this section if it is not applicable to the region.
		default: 'https://twitter.com/hgsupport',
		AR: 'false',
		BO: 'false',
		BR: 'false',
		CL: 'false',
		CO: 'false',
		DO: 'false',
		EC: 'false',
		MX: 'false',
		PE: 'false',
		UY: 'false',
	},
	help_kb: {
		// Region-specific Knowledgebase url.
		default: 'https://www.hostgator.com/help',
		AR: 'https://soporte.hostgator.mx/hc/es-419',
		BO: 'https://soporte.hostgator.mx/hc/es-419',
		BR: 'https://suporte.hostgator.com.br/hc/pt-br',
		CL: 'https://soporte.hostgator.mx/hc/es-419',
		CO: 'https://soporte.hostgator.mx/hc/es-419',
		DO: 'https://soporte.hostgator.mx/hc/es-419',
		EC: 'https://soporte.hostgator.mx/hc/es-419',
		MX: 'https://soporte.hostgator.mx/hc/es-419',
		PE: 'https://soporte.hostgator.mx/hc/es-419',
		UY: 'https://soporte.hostgator.mx/hc/es-419',
	},
	help_blog: {
		// Region-specific Blog url.
		default: 'https://www.hostgator.com/blog/',
		AR: 'https://www.hostgator.mx/blog/',
		BO: 'https://www.hostgator.mx/blog/',
		BR: 'https://www.hostgator.com.br/blog/',
		CL: 'https://www.hostgator.mx/blog/',
		CO: 'https://www.hostgator.mx/blog/',
		DO: 'https://www.hostgator.mx/blog/',
		EC: 'https://www.hostgator.mx/blog/',
		MX: 'https://www.hostgator.mx/blog/',
		PE: 'https://www.hostgator.mx/blog/',
		UY: 'https://www.hostgator.mx/blog/',
	},
	help_youtube: {
		// Region-specific YouTube url.
		default: 'https://www.youtube.com/c/hostgatorUS',
		AR: 'https://www.youtube.com/c/HostGatorMexico',
		BO: 'https://www.youtube.com/c/HostGatorMexico',
		BR: 'https://www.youtube.com/user/HostGatorBRTV',
		CL: 'https://www.youtube.com/c/HostGatorMexico',
		CO: 'https://www.youtube.com/c/HostGatorMexico',
		DO: 'https://www.youtube.com/c/HostGatorMexico',
		EC: 'https://www.youtube.com/c/HostGatorMexico',
		MX: 'https://www.youtube.com/c/HostGatorMexico',
		PE: 'https://www.youtube.com/c/HostGatorMexico',
		UY: 'https://www.youtube.com/c/HostGatorMexico',
	},
};

export default region;
