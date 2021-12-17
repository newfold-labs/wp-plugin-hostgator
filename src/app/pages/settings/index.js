import './stylesheet.scss';

import AutomaticUpdates from './automaticUpdates';
import ComingSoon from './comingSoon';
import CommentSettings from './commentSettings';
import ContentSettings from './contentSettings';
import CacheSettings from './cacheSettings';

const Settings = () => {

	return (
		<div className="hgwp-Settings grid col2">
			<AutomaticUpdates />
			<ComingSoon />
			<CommentSettings />
			<ContentSettings />
			<CacheSettings />
		</div>

	);
};

export default Settings;
