import './stylesheet.scss';
import ComingSoonSection from './comingSoonSection';
import WebContentSection from './webContentSection';
import WebHostingSection from './webHostingSection';

const Home = () => {
	
	return (
		<div className="hgwp-home ">
			<ComingSoonSection />
			<WebContentSection />
			<WebHostingSection />
		</div>
	);
};

export default Home;