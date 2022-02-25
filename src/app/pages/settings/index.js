import './stylesheet.scss';
import graphicUrl from '../../../../assets/svg/a-illustration__gaming.svg';
import AutomaticUpdates from './automaticUpdates';
import ComingSoon from './comingSoon';
import CommentSettings from './commentSettings';
import ContentSettings from './contentSettings';
import PerformanceCallout from './performanceCallout';
import { useViewportMatch } from '@wordpress/compose';

const Settings = () => {
	const isWideViewport = useViewportMatch('large');
	return (
		<div className="hgwp-Settings grid col2 has-page-graphic">
			<AutomaticUpdates />
			{isWideViewport && (
				<div><img src={graphicUrl} style={{ float: 'right'}} alt={__('Settings illustration', 'wp-plugin-hostgator')} /></div>
			)}
			<ComingSoon />
			<ContentSettings />
			<CommentSettings />
			<PerformanceCallout />
			
		</div>
	);
};

export default Settings;
