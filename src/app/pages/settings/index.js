import './stylesheet.scss';
import { ReactComponent as Graphic } from '../../../../assets/svg/a-illustration__gaming.svg';

import AutomaticUpdates from './automaticUpdates';
import ComingSoon from './comingSoon';
import CommentSettings from './commentSettings';
import ContentSettings from './contentSettings';

const Settings = () => {

	return (
		<div className="hgwp-Settings grid col2 has-page-graphic">
			<AutomaticUpdates />
			<ComingSoon />
			<CommentSettings />
			<ContentSettings />
			<Graphic className="hgwp-page-graphic" />
		</div>

	);
};

export default Settings;
