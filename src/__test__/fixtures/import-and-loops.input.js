// @flow

import React from 'react';
import type { ExternalType } from '../types';

export type T = {
    flag: boolean,
    list: Array<ExternalType>,
};

const C = ({
    flag,
    list,
}: T) => {
    return flag
        ? <div>yes</div>
        : <Select>
            {list.map((e: ExternalType) => {
                return (
                    <option value={e.id} key={e.id}>
                    </option>
                );
            })}
        </Select>;
};

export default C;
