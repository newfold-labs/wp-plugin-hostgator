import { ReactComponent as Phone } from '../../../assets/svg/a-icon__mobilephone_-blue-50.svg';
import { ReactComponent as Chat } from '../../../assets/svg/a-icon__chat_-orange-50.svg';
import { ReactComponent as Tweet } from '../../../assets/svg/a-icon__tweet_-yellow-50.svg';
import { ReactComponent as Book } from '../../../assets/svg/a-icon__book_-orange-50.svg';
import { ReactComponent as Site } from '../../../assets/svg/a-icon__website_-blue-50.svg';
import { ReactComponent as Video } from '../../../assets/svg/a-icon__youtube_-orange-50.svg';

const help = [
	{
		name: 'phone',
		title: __('Phone', 'hostgator-wordpress-plugin'),
        description: __('Give us a ring at (866) 96-GATOR', 'hostgator-wordpress-plugin'),
        icon: 'phone',
		Svg: Phone,
		cta: __('Call Us', 'hostgator-wordpress-plugin'),
		url: 'tel:(866)_964-286',
	},
	{
		name: 'chat',
		title: __('Chat', 'hostgator-wordpress-plugin'),
        description: __('Have a question? We\'re here 24/7/365', 'hostgator-wordpress-plugin'),
        icon: 'format-chat',
		Svg: Chat,
		cta: __('Live Chat', 'hostgator-wordpress-plugin'),
		url: 'https://helpchat.hostgator.com/',
	},
	{
		name: 'twitter',
		title: __('Tweet', 'hostgator-wordpress-plugin'),
        description: __('Tweet us at @hgsupport for support', 'hostgator-wordpress-plugin'),
        icon: 'twitter',
		Svg: Tweet,
		cta: __('Tweet Us', 'hostgator-wordpress-plugin'),
		url: 'https://twitter.com/hgsupport',
	},
	{
		name: 'kb',
		title: __('Knowledge Base', 'hostgator-wordpress-plugin'),
        description: __('Know what the pros know.', 'hostgator-wordpress-plugin'),
        icon: 'book',
		Svg: Book,
		cta: __('Find Answers', 'hostgator-wordpress-plugin'),
		url: 'https://www.hostgator.com/help',
	},
	{
		name: 'blog',
		title: __('Blog', 'hostgator-wordpress-plugin'),
        description: __('Get our tips and in-depth articles.', 'hostgator-wordpress-plugin'),
        icon: 'text-page',
		Svg: Site,
		cta: __('Learn Stuff', 'hostgator-wordpress-plugin'),
		url: 'https://www.hostgator.com/blog/',
	},
	{
		name: 'video',
		title: __('Video Tutorials', 'hostgator-wordpress-plugin'),
        description: __('Step-by-step tutorials and additional guides.', 'hostgator-wordpress-plugin'),
        icon: 'format-video',
		Svg: Video,
		cta: __('Watch Now', 'hostgator-wordpress-plugin'),
		url: 'https://www.youtube.com/c/hostgatorUS',
	},
];

export default help;