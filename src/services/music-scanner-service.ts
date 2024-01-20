import RNFS from 'react-native-fs';
import { minimatch } from 'minimatch';
import { FFprobeKit } from 'ffmpeg-kit-react-native';

export interface MusicProps {
  artist: string;
  title: string;
  url: string;
}

export const musicScanner = async (): Promise<MusicProps[] | undefined> => {
  const paths = await RNFS.readDir(RNFS.ExternalStorageDirectoryPath);
  const musicPath = paths.find(path => path.name === 'Music');
  const match = minimatch.filter('*.{mp3,flac}', { matchBase: true });
  const musics: MusicProps[] = [];

  if (!musicPath) {
    throw new Error('Default music folder could not be found!');
  }

  try {
    const loadedMusics = await (
      await RNFS.readDir(musicPath.path)
    )
      .filter(file => file.isFile)
      .filter(file => match(file.name))
      .map(async music => {
        try {
          const session = await FFprobeKit.getMediaInformation(music.path);
          const information = await session.getMediaInformation();
          if (information) {
            const tags = information.getTags();
            return {
              url: music.path,
              title:
                'title' in tags
                  ? tags.title
                  : music.name.replace(/\.[^.]+$/, ''),
              artist: 'artist' in tags ? tags.artist : 'Unknown Artist',
            } as MusicProps;
          }
        } catch (error) {
          return {
            url: music.path,
            title: music.name.replace(/\.[^.]+$/, ''),
            artist: 'Unknown Artist',
          } as MusicProps;
        }
      });

    const scannedMusics = await Promise.all(loadedMusics);
    scannedMusics.forEach(music => {
      if (music) {
        musics.push(music);
      }
    });
  } catch (error) {
    console.log(error);
  }

  return musics;
};
