/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React from 'react';
import { EuiPanel, EuiTitle, EuiSpacer } from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import { FormattedMessage } from '@kbn/i18n/react';

import { VisOptionsProps, VisOptionsSetValue } from 'ui/vis/editors/default';
import { BasicOptions } from '../controls/basic_options';
import { SwitchOption } from '../controls/switch';
import { TruncateLabelsOption } from '../controls/truncate_labels';

function PieOptions(props: VisOptionsProps) {
  const { stateParams, setValue } = props;
  const setLabels: VisOptionsSetValue = (paramName, value) =>
    setValue('labels', { ...stateParams.labels, [paramName]: value });

  return (
    <>
      <EuiPanel paddingSize="s">
        <EuiTitle size="xs">
          <div>
            <FormattedMessage
              id="kbnVislibVisTypes.editors.pie.pieSettingsTitle"
              defaultMessage="Pie settings"
            />
          </div>
        </EuiTitle>
        <EuiSpacer size="s" />
        <SwitchOption
          label={i18n.translate('kbnVislibVisTypes.editors.pie.donutLabel', {
            defaultMessage: 'Donut',
          })}
          paramName="isDonut"
          value={stateParams.isDonut}
          setValue={setValue}
        />
        <BasicOptions {...props} />
      </EuiPanel>

      <EuiSpacer size="s" />

      <EuiPanel paddingSize="s">
        <EuiTitle size="xs">
          <div>
            <FormattedMessage
              id="kbnVislibVisTypes.editors.pie.labelsSettingsTitle"
              defaultMessage="Labels settings"
            />
          </div>
        </EuiTitle>
        <EuiSpacer size="s" />
        <SwitchOption
          label={i18n.translate('kbnVislibVisTypes.editors.pie.showLabelsLabel', {
            defaultMessage: 'Show labels',
          })}
          paramName="show"
          value={stateParams.labels.show}
          setValue={setLabels}
        />
        <SwitchOption
          label={i18n.translate('kbnVislibVisTypes.editors.pie.showTopLevelOnlyLabel', {
            defaultMessage: 'Show top level only',
          })}
          paramName="last_level"
          value={stateParams.labels.last_level}
          setValue={setLabels}
        />
        <SwitchOption
          label={i18n.translate('kbnVislibVisTypes.editors.pie.showValuesLabel', {
            defaultMessage: 'Show values',
          })}
          paramName="values"
          value={stateParams.labels.values}
          setValue={setLabels}
        />
        <TruncateLabelsOption value={stateParams.labels.truncate} setValue={setLabels} />
      </EuiPanel>
    </>
  );
}

export { PieOptions };
