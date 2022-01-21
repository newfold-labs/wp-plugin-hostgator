const services = [
	{
		name: 'codeguard',
		title: __('CodeGuard', 'hostgator-wordpress-plugin'),
        description: <>
            <p>Avoid downtime and maintenance. CodeGuard automatically backs your site up and monitors it for changes.</p>
            <p>Daily automatic backups that give you a plan against viruses, hackers, and even your own code accidentally breaking your site. Our automatic website backup service offers full protection and daily monitoring so your data is safe.</p>
        </>,
        price: '2.99/month',
		cta: __('Learn More', 'hostgator-wordpress-plugin'),
		url: 'https://www.hostgator.com/codeguard',
        img: HGWP.assets + 'images/accord-codeguard.png',
	},
	{
		name: 'seo',
		title: __('SEO Tools', 'hostgator-wordpress-plugin'),
        description: <>
            <p>Increase traffic to your website and boost your online rankings with SEO Tools. SEO Is Vital To Online Success!</p>
            <ul>
                <li>Increase Search Engine Visibility With SEO Services</li>
                <li>Attract More Potential Customers to Your Website</li>
                <li>Work with Experienced Professionals</li>
            </ul>
        </>,
		cta: __('Get a FREE SEO Review', 'hostgator-wordpress-plugin'),
		url: 'https://www.hostgator.com/services/seo',
        img: HGWP.assets + 'images/accord-seo.png',
	},
    {
        name: 'ppc',
        title: __('PPC', 'hostgator-wordpress-plugin'),
        description: <>
            <p>PPC Advertising Can Increase Performance And Drive More Revenue!</p>
            <ul>
                <li>Improve Your Google Ads Performance</li>
                <li>Increase Your Conversions</li>
                <li>Work With PPC Experts</li>
            </ul>
        </>,
        cta: __('Get More Leads', 'hostgator-wordpress-plugin'),
        url: 'https://www.hostgator.com/services/ppc',
        img: HGWP.assets + 'images/accord-sitelock.png',
    },
    {
        name: 'webdesign',
        title: __('Web Design Services', 'hostgator-wordpress-plugin'),
        description: <>
            <p>Impress Potential Clients With A Site Designed By Pros!</p>
            <ul>
                <li>Professional, Mobile-friendly Website Design</li>
                <li>Increased Search Ranking in Google and Major Search Engines</li>
                <li>Monthly Campaign Review with a Dedicated Account Manager</li>
            </ul>
        </>,
        cta: __('Custom Design Your Website', 'hostgator-wordpress-plugin'),
        url: 'https://www.hostgator.com/services/web-design',
        img: HGWP.assets + 'images/accord-ssl.png',
    },
];

export default services;