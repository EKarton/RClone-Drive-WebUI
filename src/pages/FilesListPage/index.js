import useRemotePathParams from 'hooks/useRemotePathParams';
import Header from './Header';
import Table from './Table';
import './index.scss';
import { FileMoverProvider } from 'contexts/FileMover';
import { FileRenamerProvider } from 'contexts/FileRenamer';

export default function FilesListPage() {
  const { remote, path } = useRemotePathParams();

  return (
    <FileMoverProvider>
      <FileRenamerProvider>
        <div className="filelist-page__container">
          <Header remote={remote} path={path} />
          <Table remote={remote} path={path} />
        </div>
      </FileRenamerProvider>
    </FileMoverProvider>
  );
}
