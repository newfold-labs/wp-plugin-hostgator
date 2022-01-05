import './stylesheet.scss';

import AutomaticUpdates from './automaticUpdates';
import ComingSoon from './comingSoon';
import CommentSettings from './commentSettings';
import ContentSettings from './contentSettings';

const Settings = () => {

	return (
		<div className="hgwp-Settings grid col2">
			<AutomaticUpdates />
			<ComingSoon />
			<CommentSettings />
			<ContentSettings />
		</div>

	);
};

export default Settings;
