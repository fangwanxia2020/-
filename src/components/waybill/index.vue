<template>
  <div class="materia-box">
    <div class="materia-box-left">
      <div class="materia-box-left-name">
        <span class="materia-box-left-name-l">{{
          titleName ? titleName : "无"
        }}</span>
      </div>
      <el-menu
        :default-active="itemIndex"
        class="el-menu-vertical-demo"
        @select="handleSelect"
      >
        <el-menu-item
          v-for="(item, index) in subItemList"
          :key="index"
          :index="item.ind"
          style="
            height: 40px;
            line-height: 40px;
            text-align: center;
            padding-left: 0;
            font-size: 16px;
            font-weight: bold;
          "
        >
          <span slot="title">{{ item.name }}</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="materia-box-right">
      <el-row v-if="itemIndex == '1'">
        <el-col :span="16">
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">中文名：</div>
            <div class="materia-box-right-box-name">
              {{ titleName ? titleName : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">化学俗名:</div>
            <div class="materia-box-right-box-name">
              {{ waybillData && waybillData.alias ? waybillData.alias : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">英文名:</div>
            <div class="materia-box-right-box-name">
              {{
                waybillData && waybillData.enName ? waybillData.enName : "无"
              }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">CAS-NO:</div>
            <div class="materia-box-right-box-name">
              {{ waybillData && waybillData.casNo ? waybillData.casNo : "无" }}
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="itemIndex == '2'">
        <el-col :span="16">
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">有害成分:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p2Component ? itemData.p2Component : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">含量:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p2Content ? itemData.p2Content : "无" }}
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="itemIndex == '3'">
        <el-col :span="16">
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">危险性类别:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p3RiskCategory ? itemData.p3RiskCategory : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">浸入途径:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p3InvasionChn ? itemData.p3InvasionChn : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">健康危害:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p3HealthHazard ? itemData.p3HealthHazard : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">环境危害:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p3EnvHazard ? itemData.p3EnvHazard : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">燃爆危害:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p3ExplosionRisk ? itemData.p3ExplosionRisk : "无" }}
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="itemIndex == '4'">
        <el-col :span="16">
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">皮肤接触:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p4SkinContact ? itemData.p4SkinContact : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">眼睛接触:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p4EyeContact ? itemData.p4EyeContact : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">吸入:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p4Inspiroation ? itemData.p4Inspiroation : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">食入:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p4Ingestion ? itemData.p4Ingestion : "无" }}
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="itemIndex == '5'">
        <el-col :span="16">
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">危险特征:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p5Hc ? itemData.p5Hc : "无" }}"
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">有害燃烧产物:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p5Hcp ? itemData.p5Hcp : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">灭火方法:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p5Emethod ? itemData.p5Emethod : "无" }}
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="itemIndex == '6'">
        <el-col :span="16">
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">应急处理:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p6EmerHandle ? itemData.p6EmerHandle : "无" }}
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="itemIndex == '7'">
        <el-col :span="16">
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">操作注意事项:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p7Hc ? itemData.p7Hc : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">存储注意事项:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p7Sc ? itemData.p7Sc : "无" }}
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="itemIndex == '8'">
        <el-col :span="16">
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">中国MAC(mg/m3):</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p8CnMac ? itemData.p8CnMac : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">前苏联MAC(mg/m3):</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p8FsuMac ? itemData.p8FsuMac : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">TLVTN:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p8Tlvtn ? itemData.p8Tlvtn : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">TLVWN:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p8Tlvwn ? itemData.p8Tlvwn : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">监测方法:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p8Dmethod ? itemData.p8Dmethod : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">工程控制:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p8EngCtrl ? itemData.p8EngCtrl : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">呼吸系统防护:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p8RProtection ? itemData.p8RProtection : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">眼睛防护:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p8EProtection ? itemData.p8EProtection : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">身体防护:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p8BProtection ? itemData.p8BProtection : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">手防护:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p8HProtection ? itemData.p8HProtection : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">其他防护:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p8OProtection ? itemData.p8OProtection : "无" }}
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="itemIndex == '9'">
        <el-col :span="12">
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">外观与性状:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p9Feature ? itemData.p9Feature : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">熔点(℃):</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p9MeltPoint ? itemData.p9MeltPoint : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">沸点(℃):</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p9BoilPoint ? itemData.p9BoilPoint : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">分子式:</div>
            <div class="materia-box-right-box-name">
              {{
                itemData.p9MolecularFormula ? itemData.p9MolecularFormula : "无"
              }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">主要成分:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p9MainIngredient ? itemData.p9MainIngredient : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">燃烧热(kJ/mol):</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p9Hoc ? itemData.p9Hoc : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">临界压力(MPa):</div>
            <div class="materia-box-right-box-name">
              {{
                itemData.p9CriticalPressure ? itemData.p9CriticalPressure : "无"
              }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">爆炸上限%(V/V):</div>
            <div class="materia-box-right-box-name">
              {{
                itemData.p9UpperExplosionLimit
                  ? itemData.p9UpperExplosionLimit
                  : "无"
              }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">引燃温度(℃):</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p9IgnitionTemp ? itemData.p9IgnitionTemp : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">主要用途:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p9MainPurpose ? itemData.p9MainPurpose : "无" }}
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">pH:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p9Ph ? itemData.p9Ph : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">相对密度(水=1):</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p9Density ? itemData.p9Density : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">相对蒸气密度(空气=1):</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p9VaporDensity ? itemData.p9VaporDensity : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">分子量:</div>
            <div class="materia-box-right-box-name">
              {{
                itemData.p9MolecularWeight ? itemData.p9MolecularWeight : "无"
              }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">饱和蒸汽压(kPa):</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p9Svp ? itemData.p9Svp : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">临界温度(℃):</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p9CriticalTemp ? itemData.p9CriticalTemp : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">闪点(℃):</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p9FlashPoint ? itemData.p9FlashPoint : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">爆炸下限%(V/V):</div>
            <div class="materia-box-right-box-name">
              {{
                itemData.p9LowerExplosionLimit
                  ? itemData.p9LowerExplosionLimit
                  : "无"
              }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">溶解性:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p9Solubility ? itemData.p9Solubility : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">其它理化性质:</div>
            <div class="materia-box-right-box-name">
              {{
                itemData.p9OtherProperties ? itemData.p9OtherProperties : "无"
              }}
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="itemIndex == '10'">
        <el-col :span="16">
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">稳定性:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p10Stability ? itemData.p10Stability : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">禁配物:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p10Incompatible ? itemData.p10Incompatible : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">避免接触的条件:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p10Cac ? itemData.p10Cac : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">聚合危害:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p10PHazard ? itemData.p10PHazard : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">分解产物:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p10DProd ? itemData.p10DProd : "无" }}
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="itemIndex == '11'">
        <el-col :span="16">
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">急性毒性:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p11AcuteToxicity ? itemData.p11AcuteToxicity : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">亚急性和慢性毒性:</div>
            <div class="materia-box-right-box-name">
              {{
                itemData.p11ChronicToxicity ? itemData.p11ChronicToxicity : "无"
              }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">刺激性:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p11Irritating ? itemData.p11Irritating : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">致敏性:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p11Sensitization ? itemData.p11Sensitization : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">致突变性:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p11Mutagenicity ? itemData.p11Mutagenicity : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">致畸性:</div>
            <div class="materia-box-right-box-name">
              {{
                itemData.p11Teratogenicity ? itemData.p11Teratogenicity : "无"
              }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">致癌性:</div>
            <div class="materia-box-right-box-name">
              {{
                itemData.p11Carcinogenicity ? itemData.p11Carcinogenicity : "无"
              }}
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="itemIndex == '12'">
        <el-col :span="16">
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">生态毒理毒性:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p12Ecotoxicity ? itemData.p12Ecotoxicity : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">生物降解性:</div>
            <div class="materia-box-right-box-name">
              {{
                itemData.p12Biodegradability
                  ? itemData.p12Biodegradability
                  : "无"
              }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">非生物降解性:</div>
            <div class="materia-box-right-box-name">
              {{
                itemData.p12NonBiodegradability
                  ? itemData.p12NonBiodegradability
                  : "无"
              }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">生物富集或生物积累性:</div>
            <div class="materia-box-right-box-name">
              {{
                itemData.p12Bioaccumulation ? itemData.p12Bioaccumulation : "无"
              }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">其它有害作用:</div>
            <div class="materia-box-right-box-name">
              {{
                itemData.p12OtherHarmfulEffects
                  ? itemData.p12OtherHarmfulEffects
                  : "无"
              }}
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="itemIndex == '13'">
        <el-col :span="16">
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">废弃物性质:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p13WasteNature ? itemData.p13WasteNature : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">废弃处置方法:</div>
            <div class="materia-box-right-box-name">
              {{
                itemData.p13DisposalMethod ? itemData.p13DisposalMethod : "无"
              }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">废弃注意事项:</div>
            <div class="materia-box-right-box-name">
              {{
                itemData.p13DisposalConsiderations
                  ? itemData.p13DisposalConsiderations
                  : "无"
              }}
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="itemIndex == '14'">
        <el-col :span="16">
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">危险货物编号:</div>
            <div class="materia-box-right-box-name">
              {{
                itemData.p14DangrousGoodNo ? itemData.p14DangrousGoodNo : "无"
              }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">UN编号:</div>
            <div class="materia-box-right-box-name">
              {{ waybillData.un ? waybillData.un : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">包装标志:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p14PkgMark ? itemData.p14PkgMark : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">包装类别:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p14PkgCategory ? itemData.p14PkgCategory : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">包装方法:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p14PkgMethod ? itemData.p14PkgMethod : "无" }}
            </div>
          </div>
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">运输注意事项:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p14Tc ? itemData.p14Tc : "无" }}
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="itemIndex == '15'">
        <el-col :span="16">
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">法规信息:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p15LawInfo ? itemData.p15LawInfo : "无" }}
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="itemIndex == '16'">
        <el-col :span="16">
          <div class="materia-box-right-box">
            <div class="materia-box-right-box-label">参考文献:</div>
            <div class="materia-box-right-box-name">
              {{ itemData.p16References ? itemData.p16References : "无" }}
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    waybillData: {
      type: Object,
      default: () => {},
    },
    titleName: {
      type: String,
      default: () => {},
    },
  },
  data() {
    return {
      itemIndex: "1",
      itemData: {},
      subItemList: [
        { ind: "1", name: "化学品名称" },
        { ind: "2", name: "成分/组成信息" },
        { ind: "3", name: "危险性概述" },
        { ind: "4", name: "急救措施" },
        { ind: "5", name: "消防措施" },
        { ind: "6", name: "泄漏应急处理" },
        { ind: "7", name: "操作处置与储存" },
        { ind: "8", name: "接触控制/个体防护" },
        { ind: "9", name: "理化特性" },
        { ind: "10", name: "稳定性和反应活性" },
        { ind: "11", name: "毒理学资料" },
        { ind: "12", name: "生态学资料" },
        { ind: "13", name: "废弃处置" },
        { ind: "14", name: "运输信息" },
        { ind: "15", name: "法规信息" },
        { ind: "16", name: "其他信息" },
      ],
    };
  },

  computed: {},
  mounted() {
    console.log(this.waybillData, "和跟换更换跟换更换");
    if (this.waybillData) {
      this.itemData = this.waybillData.hazardMsdsDto;
    }
    // this.itemData = this.waybillData.hazardMsdsDto;
  },
  methods: {
    handleSelect(key) {
      console.log(key);
      this.itemIndex = key;
    },
  },
};
</script>
<style lang="scss" scoped>
.materia-box {
  display: flex;
  &-left {
    width: 270px;
    &-name {
      text-align: center;
      margin-right: 20px;
      font-size: 16px;
      font-weight: bold;
      &-l {
        padding: 0 20px;
        border-bottom: 1px solid #ccc;
        display: inline-block;
        padding-bottom: 5px;
      }
    }
  }
  &-right {
    width: 100%;
    padding-top: 40px;
    padding-bottom: 20px;
    &-box {
      display: flex;
      margin-left: 20px;
      margin-bottom: 40px;
      &-label {
        flex: 2;
        text-align: right;
        margin-right: 10px;
      }
      &-name {
        flex: 6;
      }
    }
  }
}
</style>
