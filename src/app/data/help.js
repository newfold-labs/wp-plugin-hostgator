const help = [
	{
		name: 'phone',
		title: __( 'Phone', 'wp-plugin-hostgator' ),
		description: __(
			'Give us a ring at (866) 96-GATOR',
			'wp-plugin-hostgator'
		),
		icon: false,
		cta: __( 'Call Us', 'wp-plugin-hostgator' ),
		id: 'help_phone_number',
		url: 'tel:18669642867',
	},
	{
		name: 'chat',
		title: __( 'Chat', 'wp-plugin-hostgator' ),
		description: __(
			"Have a question? We're here 24/7/365",
			'wp-plugin-hostgator'
		),
		icon: false,
		cta: __( 'Live Chat', 'wp-plugin-hostgator' ),
		id: 'help_chat',
		url: 'https://helpchat.hostgator.com/?utm_campaign=&utm_content=help_chat_link&utm_term=live_chat&utm_medium=brand_plugin&utm_source=wp-admin/admin.php?page=hostgator#/help',
	},
	{
		name: 'twitter',
		title: __( 'Tweet', 'wp-plugin-hostgator' ),
		description: __(
			'Tweet us at @hgsupport for support',
			'wp-plugin-hostgator'
		),
		icon: false,
		cta: __( 'Tweet Us', 'wp-plugin-hostgator' ),
		id: 'help_twitter',
		url: 'https://twitter.com/hgsupport',
	},
	{
		name: 'kb',
		title: __( 'Knowledge Base', 'wp-plugin-hostgator' ),
		description: __( 'Know what the pros know.', 'wp-plugin-hostgator' ),
		icon: false,
		cta: __( 'Find Answers', 'wp-plugin-hostgator' ),
		id: 'help_kb',
		url: 'https://www.hostgator.com/help?utm_campaign=&utm_content=help_kb_link&utm_term=find_answers&utm_medium=brand_plugin&utm_source=wp-admin/admin.php?page=hostgator#/help',
	},
	{
		name: 'blog',
		title: __( 'Blog', 'wp-plugin-hostgator' ),
		description: __(
			'Get our tips and in-depth articles.',
			'wp-plugin-hostgator'
		),
		icon: false,
		cta: __( 'Learn Stuff', 'wp-plugin-hostgator' ),
		id: 'help_blog',
		url: 'https://www.hostgator.com/blog/?utm_campaign=&utm_content=help_blog_link&utm_term=learn_stuff&utm_medium=brand_plugin&utm_source=wp-admin/admin.php?page=hostgator#/help',
	},
	{
		name: 'video',
		title: __( 'Video Tutorials', 'wp-plugin-hostgator' ),
		description: __(
			'Step-by-step tutorials and additional guides.',
			'wp-plugin-hostgator'
		),
		icon: false,
		cta: __( 'Watch Now', 'wp-plugin-hostgator' ),
		id: 'help_youtube',
		url: 'https://www.youtube.com/c/hostgatorUS',
	},
];

export default help;
