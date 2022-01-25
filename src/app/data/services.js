const services = [
	{
		name: 'codeguard',
		title: __('CodeGuard', 'hostgator-wordpress-plugin'),
		description: __(
			'Protect your website with a daily, automatic backup!',
			'hostgator-wordpress-plugin'
		),
		cta: __('Learn More', 'hostgator-wordpress-plugin'),
		url: 'https://www.hostgator.com/codeguard',
		img: HGWP.assets + 'images/services-codeguard.png',
	},
	{
		name: 'ppc',
		title: __('PPC Management', 'hostgator-wordpress-plugin'),
		description: __(
			'PPC advertising can increase performance and drive more revenue!',
			'hostgator-wordpress-plugin'
		),
		cta: __('Get More Leads', 'hostgator-wordpress-plugin'),
		url: 'https://www.hostgator.com/services/ppc',
		img: HGWP.assets + 'images/services-ppc.png',
	},
	{
		name: 'webdesign',
		title: __('Web Design Services', 'hostgator-wordpress-plugin'),
		description: __(
			'Impress potential clients with a professionally-designed website!',
			'hostgator-wordpress-plugin'
		),
		cta: __('Learn More', 'hostgator-wordpress-plugin'),
		url: 'https://www.hostgator.com/services/web-design',
		img: HGWP.assets + 'images/services-webdesign.png',
	},
];

export default services;
