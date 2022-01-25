import './stylesheet.scss';
import graphicUrl from '../../../../assets/svg/a-illustration__gaming.svg';
import AutomaticUpdates from './automaticUpdates';
import ComingSoon from './comingSoon';
import CommentSettings from './commentSettings';
import ContentSettings from './contentSettings';
import { useViewportMatch } from '@wordpress/compose';

const Settings = () => {
	const isWideViewport = useViewportMatch('large');
	return (
		<div className="hgwp-Settings grid col2 has-page-graphic">
			<AutomaticUpdates />
			{isWideViewport && (
				<div>
					<img src={graphicUrl} style={{ float: 'right'}} />
				</div>
			)}
			<div>
				<ComingSoon />
				<br /><br />
				<ContentSettings />
			</div>
			<CommentSettings />
			
		</div>
	);
};

export default Settings;
