const services = [
	{
		name: 'codeguard',
		title: __('CodeGuard', 'wp-plugin-hostgator'),
		description: __(
			'Protect your website with a daily, automatic backup!',
			'wp-plugin-hostgator'
		),
		cta: __('Learn More', 'wp-plugin-hostgator'),
		url: 'https://www.hostgator.com/codeguard',
		img: HGWP.assets + 'images/services-codeguard.png',
	},
	{
		name: 'ppc',
		title: __('PPC Management', 'wp-plugin-hostgator'),
		description: __(
			'PPC advertising can increase performance and drive more revenue!',
			'wp-plugin-hostgator'
		),
		cta: __('Get More Leads', 'wp-plugin-hostgator'),
		url: 'https://www.hostgator.com/services/ppc',
		img: HGWP.assets + 'images/services-ppc.png',
	},
	{
		name: 'webdesign',
		title: __('Web Design Services', 'wp-plugin-hostgator'),
		description: __(
			'Impress potential clients with a professionally-designed website!',
			'wp-plugin-hostgator'
		),
		cta: __('Learn More', 'wp-plugin-hostgator'),
		url: 'https://www.hostgator.com/services/web-design',
		img: HGWP.assets + 'images/services-webdesign.png',
	},
];

export default services;
